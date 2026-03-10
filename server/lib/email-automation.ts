import { supabaseRemote } from './supabase-remote';
import { sendEmail } from './resend';
import { DEFAULT_EMAIL_TEMPLATES } from './email-templates';

export type AutomationTrigger =
  | 'user_signup'
  | 'user_login'
  | 'order_placed'
  | 'order_shipped'
  | 'order_delivered'
  | 'cart_abandoned'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'onboarding_completed'
  | 'course_started'
  | 'course_completed'
  | 'lesson_completed'
  | 'mentorship_assigned'
  | 'mentorship_week_advanced'
  | 'store_connected'
  | 'store_claimed'
  | 'products_uploaded'
  | 'llc_status_changed'
  | 'user_inactive'
  | 'milestone_reached'
  | 'custom_event';

interface AutomationCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number;
}

interface AutomationRecord {
  id: string;
  name: string;
  trigger: string;
  conditions: AutomationCondition[];
  template_id: string | null;
  delay: number;
  delay_unit: string;
  is_active: boolean;
  target_audience: string;
  plan_levels: string[];
}

function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }
  return result;
}

function evaluateConditions(conditions: AutomationCondition[], metadata: Record<string, any>): boolean {
  if (!conditions || conditions.length === 0) return true;

  return conditions.every((condition) => {
    const fieldValue = metadata[condition.field];
    if (fieldValue === undefined) return false;

    switch (condition.operator) {
      case 'equals':
        return String(fieldValue) === String(condition.value);
      case 'not_equals':
        return String(fieldValue) !== String(condition.value);
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      default:
        return false;
    }
  });
}

function getDelayMs(delay: number, unit: string): number {
  switch (unit) {
    case 'minutes':
      return delay * 60 * 1000;
    case 'hours':
      return delay * 60 * 60 * 1000;
    case 'days':
      return delay * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

async function executeAutomation(
  automation: AutomationRecord,
  userId: string,
  metadata: Record<string, any>,
) {
  try {
    let htmlContent: string;
    let subject: string;
    let templateId: string | null = automation.template_id;

    if (templateId) {
      const { data: template, error: templateError } = await supabaseRemote
        .from('email_templates')
        .select('subject, html_content')
        .eq('id', templateId)
        .eq('is_active', true)
        .single();

      if (templateError || !template) {
        console.error(`[automation] Template ${templateId} not found or inactive for automation ${automation.id}`);
        return;
      }

      htmlContent = template.html_content;
      subject = template.subject;
    } else {
      console.error(`[automation] No template_id for automation ${automation.id}`);
      return;
    }

    const { data: profile } = await supabaseRemote
      .from('profiles')
      .select('email, full_name, account_type, subscription_plans(name, slug)')
      .eq('id', userId)
      .single();

    if (!profile?.email) {
      console.error(`[automation] No email found for user ${userId}`);
      return;
    }

    const variables: Record<string, string> = {
      'user.name': profile.full_name || 'there',
      'user.email': profile.email,
      'user.plan': (profile.subscription_plans as any)?.name || profile.account_type || 'Free',
      'user.signupDate': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      'user.credits': '0',
      'currentDate': new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      'company.name': 'USDrop AI',
      'company.email': 'support@usdrop.ai',
      'company.website': process.env.APP_URL || 'https://usdrop.ai',
      'unsubscribeLink': `${process.env.APP_URL || 'https://usdrop.ai'}/unsubscribe`,
      ...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, String(v)])
      ),
    };

    const renderedHtml = replaceVariables(htmlContent, variables);
    const renderedSubject = replaceVariables(subject, variables);

    await sendEmail(profile.email, renderedSubject, renderedHtml, {
      templateId: automation.template_id || undefined,
      automationId: automation.id,
      recipientId: userId,
      tags: [
        { name: 'automation_id', value: automation.id },
        { name: 'trigger', value: automation.trigger },
      ],
    });

    console.log(`[automation] Sent "${automation.name}" to ${profile.email}`);
  } catch (error) {
    console.error(`[automation] Failed to execute automation ${automation.id}:`, error);
  }
}

export async function triggerAutomation(
  event: AutomationTrigger,
  userId: string,
  metadata: Record<string, any> = {},
) {
  try {
    const { data: automations, error } = await supabaseRemote
      .from('email_automations')
      .select('*')
      .eq('trigger', event)
      .eq('is_active', true);

    if (error || !automations || automations.length === 0) {
      return;
    }

    for (const automation of automations as AutomationRecord[]) {
      const conditions = automation.conditions || [];
      if (!evaluateConditions(conditions, metadata)) {
        continue;
      }

      if (automation.target_audience === 'plan_based' && automation.plan_levels?.length > 0) {
        const { data: profile } = await supabaseRemote
          .from('profiles')
          .select('subscription_plans(slug)')
          .eq('id', userId)
          .single();

        const userPlanSlug = (profile?.subscription_plans as any)?.slug;
        if (userPlanSlug && !automation.plan_levels.includes(userPlanSlug)) {
          continue;
        }
      }

      const delayMs = getDelayMs(automation.delay || 0, automation.delay_unit || 'minutes');

      if (delayMs > 0) {
        setTimeout(() => {
          executeAutomation(automation, userId, metadata).catch((err) =>
            console.error(`[automation] Delayed execution failed for ${automation.id}:`, err),
          );
        }, delayMs);
      } else {
        executeAutomation(automation, userId, metadata).catch((err) =>
          console.error(`[automation] Immediate execution failed for ${automation.id}:`, err),
        );
      }
    }
  } catch (error) {
    console.error(`[automation] triggerAutomation error for event "${event}":`, error);
  }
}

const TOUCHPOINT_TO_TEMPLATE_MAP: Record<string, string> = {
  'welcome': 'Welcome Email',
  'password-reset': 'Password Reset',
  'order-confirmation': 'Order Confirmation',
  'shipping-notification': 'Shipping Notification',
  'onboarding-drip': 'Onboarding — Day 1',
  're-engagement': 'Re-engagement',
  'plan-upgrade': 'Plan Upgrade Confirmation',
  'plan-downgrade': 'Plan Downgrade / Cancellation',
};

const TOUCHPOINT_AUTOMATIONS = [
  {
    name: 'Welcome Email',
    description: 'Send welcome email immediately after user signup',
    trigger: 'user_signup',
    templateName: 'Welcome Email',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Password Reset',
    description: 'Send password reset link when requested',
    trigger: 'custom_event',
    templateName: 'Password Reset',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Order Confirmation',
    description: 'Send order confirmation immediately after order placement',
    trigger: 'order_placed',
    templateName: 'Order Confirmation',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Shipping Notification',
    description: 'Send shipping notification when order is shipped',
    trigger: 'order_shipped',
    templateName: 'Shipping Notification',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Onboarding — Day 1',
    description: 'First onboarding email sent on day 1',
    trigger: 'user_signup',
    templateName: 'Onboarding — Day 1',
    delay: 1,
    delay_unit: 'days',
    target_audience: 'all',
  },
  {
    name: 'Onboarding — Day 3',
    description: 'Second onboarding email sent on day 3',
    trigger: 'user_signup',
    templateName: 'Onboarding — Day 3',
    delay: 3,
    delay_unit: 'days',
    target_audience: 'all',
  },
  {
    name: 'Onboarding — Day 7',
    description: 'Third onboarding email sent on day 7',
    trigger: 'user_signup',
    templateName: 'Onboarding — Day 7',
    delay: 7,
    delay_unit: 'days',
    target_audience: 'all',
  },
  {
    name: 'Re-engagement',
    description: 'Send re-engagement email to inactive users',
    trigger: 'custom_event',
    templateName: 'Re-engagement',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Plan Upgrade Confirmation',
    description: 'Send confirmation when user upgrades plan',
    trigger: 'plan_upgraded',
    templateName: 'Plan Upgrade Confirmation',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Plan Downgrade Notification',
    description: 'Send notification when user downgrades plan',
    trigger: 'plan_downgraded',
    templateName: 'Plan Downgrade / Cancellation',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Order Delivered',
    description: 'Send confirmation when order is delivered',
    trigger: 'order_delivered',
    templateName: 'Order Confirmation',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Subscription Started',
    description: 'Send welcome email when subscription starts',
    trigger: 'subscription_started',
    templateName: 'Welcome Email',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Course Started Encouragement',
    description: 'Send encouragement email when user starts a course',
    trigger: 'course_started',
    templateName: 'Course Started',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Module Completed Congratulations',
    description: 'Congratulate user on completing a course module',
    trigger: 'lesson_completed',
    templateName: 'Module Completed',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'All Lessons Complete — Mentorship CTA',
    description: 'Notify user all lessons are complete and pitch mentorship',
    trigger: 'course_completed',
    templateName: 'All Lessons Complete',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Mentorship Batch Assigned',
    description: 'Welcome email when user is assigned to a mentorship batch',
    trigger: 'mentorship_assigned',
    templateName: 'Mentorship Batch Assigned',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Mentorship Week Progress',
    description: 'Weekly progress update during mentorship',
    trigger: 'mentorship_week_advanced',
    templateName: 'Mentorship Week Update',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Mentorship Session Reminder',
    description: 'Reminder email before a mentorship session',
    trigger: 'custom_event',
    templateName: 'Mentorship Session Reminder',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Shopify Store Connected',
    description: 'Confirmation when user connects their Shopify store',
    trigger: 'store_connected',
    templateName: 'Store Connected',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Store Claimed',
    description: 'Confirmation when user claims their store',
    trigger: 'store_claimed',
    templateName: 'Store Claimed',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Products Uploaded Milestone',
    description: 'Celebrate when user uploads products to their store',
    trigger: 'products_uploaded',
    templateName: 'Products Milestone',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'LLC Application Received',
    description: 'Confirm LLC application has been received',
    trigger: 'llc_status_changed',
    templateName: 'LLC Application Received',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'LLC Status Update — Filed',
    description: 'Notify user LLC has been filed',
    trigger: 'llc_status_changed',
    templateName: 'LLC Status Update',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'LLC Complete',
    description: 'Congratulate user on LLC formation completion',
    trigger: 'llc_status_changed',
    templateName: 'LLC Complete',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Re-engagement — 7 Day Inactive',
    description: 'Re-engage users inactive for 7 days',
    trigger: 'user_inactive',
    templateName: 'Re-engagement — 7 Day',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Re-engagement — 14 Day Inactive',
    description: 'Re-engage users inactive for 14 days',
    trigger: 'user_inactive',
    templateName: 'Re-engagement — 14 Day',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Re-engagement — 30 Day Inactive',
    description: 'Re-engage users inactive for 30 days',
    trigger: 'user_inactive',
    templateName: 'Re-engagement — 30 Day',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'First Month Milestone',
    description: 'Celebrate user completing their first month',
    trigger: 'milestone_reached',
    templateName: 'First Month Milestone',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'First Sale Celebration',
    description: 'Celebrate when user makes their first sale',
    trigger: 'milestone_reached',
    templateName: 'First Sale Celebration',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: '90-Day Milestone',
    description: 'Celebrate user reaching 90 days on the platform',
    trigger: 'milestone_reached',
    templateName: '90-Day Milestone',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Subscription Renewal Reminder',
    description: 'Remind user their subscription is up for renewal',
    trigger: 'custom_event',
    templateName: 'Renewal Reminder',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Feature Announcement',
    description: 'Announce new platform features to users',
    trigger: 'custom_event',
    templateName: 'Feature Announcement',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'New Course Available',
    description: 'Notify users when a new course is published',
    trigger: 'custom_event',
    templateName: 'New Course Available',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Referral Invite',
    description: 'Invite users to refer friends to the platform',
    trigger: 'custom_event',
    templateName: 'Referral Invite',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
  {
    name: 'Onboarding Completed',
    description: 'Congratulate user on completing onboarding',
    trigger: 'onboarding_completed',
    templateName: 'Onboarding Completed',
    delay: 0,
    delay_unit: 'minutes',
    target_audience: 'all',
  },
];

export async function seedDefaultAutomations() {
  try {
    const { data: existingAutomations } = await supabaseRemote
      .from('email_automations')
      .select('name')
      .limit(1);

    if (existingAutomations && existingAutomations.length > 0) {
      console.log('[automation-seed] Automations already exist, skipping seed');
      return;
    }

    const { data: existingTemplates } = await supabaseRemote
      .from('email_templates')
      .select('id, name');

    let templateMap = new Map<string, string>();

    if (existingTemplates && existingTemplates.length > 0) {
      existingTemplates.forEach((t: any) => templateMap.set(t.name, t.id));
    } else {
      const templatesToInsert = DEFAULT_EMAIL_TEMPLATES.map((t) => ({
        name: t.name,
        subject: t.subject,
        type: t.type,
        category: t.category,
        description: t.description,
        html_content: t.htmlContent,
        variables: t.variables,
        is_active: true,
      }));

      const { data: inserted, error: insertError } = await supabaseRemote
        .from('email_templates')
        .insert(templatesToInsert)
        .select('id, name');

      if (insertError) {
        console.error('[automation-seed] Failed to insert default templates:', insertError);
        return;
      }

      if (inserted) {
        inserted.forEach((t: any) => templateMap.set(t.name, t.id));
      }

      console.log(`[automation-seed] Inserted ${inserted?.length || 0} default templates`);
    }

    const automationsToInsert = TOUCHPOINT_AUTOMATIONS.map((a) => ({
      name: a.name,
      description: a.description,
      trigger: a.trigger,
      template_id: templateMap.get(a.templateName) || null,
      delay: a.delay,
      delay_unit: a.delay_unit,
      is_active: true,
      target_audience: a.target_audience,
      conditions: [],
      plan_levels: [],
    })).filter((a) => a.template_id !== null);

    if (automationsToInsert.length > 0) {
      const { error: autoError } = await supabaseRemote
        .from('email_automations')
        .insert(automationsToInsert);

      if (autoError) {
        console.error('[automation-seed] Failed to insert automations:', autoError);
      } else {
        console.log(`[automation-seed] Inserted ${automationsToInsert.length} default automations`);
      }
    }
  } catch (error) {
    console.error('[automation-seed] Seed error:', error);
  }
}
