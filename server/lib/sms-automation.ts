import { supabaseRemote } from './supabase-remote';
import { sendSms } from './twilio';

export type SmsAutomationTrigger =
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

interface SmsAutomationRecord {
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

async function executeSmsAutomation(
  automation: SmsAutomationRecord,
  userId: string,
  metadata: Record<string, any>,
) {
  try {
    const templateId = automation.template_id;

    if (!templateId) {
      console.error(`[sms-automation] No template_id for automation ${automation.id}`);
      return;
    }

    const { data: template, error: templateError } = await supabaseRemote
      .from('sms_templates')
      .select('body, variables')
      .eq('id', templateId)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error(`[sms-automation] Template ${templateId} not found or inactive for automation ${automation.id}`);
      return;
    }

    const { data: profile } = await supabaseRemote
      .from('profiles')
      .select('email, full_name, phone_number, account_type, subscription_plans(name, slug)')
      .eq('id', userId)
      .single();

    if (!profile?.phone_number) {
      console.error(`[sms-automation] No phone number found for user ${userId}`);
      return;
    }

    const variables: Record<string, string> = {
      'user.name': profile.full_name || 'there',
      'user.email': profile.email || '',
      'user.phone': profile.phone_number,
      'user.plan': (profile.subscription_plans as any)?.name || profile.account_type || 'Free',
      'company.name': 'USDrop AI',
      'company.website': process.env.APP_URL || 'https://usdrop.ai',
      ...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, String(v)])
      ),
    };

    const renderedMessage = replaceVariables(template.body, variables);

    let status: 'sent' | 'failed' = 'sent';
    let errorMessage: string | undefined;
    let twilioMetadata: Record<string, any> = {};

    try {
      const result = await sendSms(profile.phone_number, renderedMessage);
      twilioMetadata = { sid: result.sid, status: result.status };
    } catch (sendError: any) {
      status = 'failed';
      errorMessage = sendError?.message || 'Unknown send error';
      console.error(`[sms-automation] Failed to send SMS for automation ${automation.id}:`, sendError);
    }

    try {
      await supabaseRemote.from('sms_logs').insert({
        recipient_phone: profile.phone_number,
        recipient_id: userId,
        template_id: templateId,
        automation_id: automation.id,
        message: renderedMessage,
        status,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
        error_message: errorMessage || null,
        metadata: {
          trigger: automation.trigger,
          ...twilioMetadata,
        },
      });
    } catch (logError) {
      console.error('[sms-automation] Failed to log SMS to Supabase:', logError);
    }

    if (status === 'sent') {
      console.log(`[sms-automation] Sent "${automation.name}" to ${profile.phone}`);
    }
  } catch (error) {
    console.error(`[sms-automation] Failed to execute automation ${automation.id}:`, error);
  }
}

interface SmsTemplateDefinition {
  id: string;
  name: string;
  body: string;
  category: string;
  type: string;
  variables: string[];
  is_active: boolean;
}

interface SmsAutomationDefinition {
  id: string;
  name: string;
  description: string;
  trigger: SmsAutomationTrigger;
  conditions: AutomationCondition[];
  template_id: string;
  delay: number;
  delay_unit: string;
  is_active: boolean;
  target_audience: string;
  plan_levels: string[];
}

const DEFAULT_SMS_TEMPLATES: SmsTemplateDefinition[] = [
  { id: 'a1000001-0001-4000-8000-000000000001', name: 'Welcome SMS', body: 'Welcome to USDrop AI, {{user.name}}! Your dropshipping journey starts now. Log in at {{company.website}} to begin.', category: 'transactional', type: 'welcome', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0001-4000-8000-000000000002', name: 'OTP Verification', body: 'Your USDrop verification code is {{otp_code}}. It expires in 10 minutes. Do not share this code.', category: 'utility', type: 'otp', variables: ['otp_code'], is_active: true },
  { id: 'a1000001-0002-4000-8000-000000000001', name: 'Profile Reminder Day 1', body: 'Hey {{user.name}}, complete your USDrop profile to unlock personalized product recommendations. It takes 2 min: {{company.website}}/my-profile', category: 'marketing', type: 'onboarding_reminder', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0002-4000-8000-000000000002', name: 'Complete Onboarding Nudge Day 3', body: "{{user.name}}, you're almost there! Finish onboarding to access winning products, supplier connections & more. {{company.website}}/home", category: 'marketing', type: 'onboarding_nudge', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0003-4000-8000-000000000001', name: 'Course Started Encouragement', body: "Great start, {{user.name}}! You just began \"{{course_name}}\". Stay consistent and you'll master dropshipping in no time.", category: 'marketing', type: 'course_started', variables: ['user.name', 'course_name'], is_active: true },
  { id: 'a1000001-0003-4000-8000-000000000002', name: 'Module Completion Congrats', body: 'Congrats {{user.name}}! You completed the "{{module_name}}" module. Keep going - knowledge is your competitive edge!', category: 'marketing', type: 'module_completed', variables: ['user.name', 'module_name'], is_active: true },
  { id: 'a1000001-0003-4000-8000-000000000003', name: 'All Lessons Complete + Mentorship CTA', body: '{{user.name}}, you finished all free lessons! Ready for 1-on-1 mentorship to accelerate your success? Explore plans: {{company.website}}/mentorship', category: 'marketing', type: 'all_lessons_complete', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0004-4000-8000-000000000001', name: 'Pro Plan Welcome', body: "Welcome to Pro, {{user.name}}! You now have access to winning products, supplier contacts & more. Let's build your empire: {{company.website}}/home", category: 'transactional', type: 'pro_welcome', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0004-4000-8000-000000000002', name: 'Elite Plan Welcome', body: "Welcome to Elite, {{user.name}}! You've unlocked everything - mentorship, priority support & advanced tools. Your dedicated team awaits: {{company.website}}/home", category: 'transactional', type: 'elite_welcome', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0004-4000-8000-000000000003', name: 'Upgrade Reminder Day 14', body: "{{user.name}}, you've been exploring USDrop for 2 weeks! Upgrade to Pro to unlock winning products & supplier connections: {{company.website}}/my-plan", category: 'marketing', type: 'upgrade_reminder_14', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0004-4000-8000-000000000004', name: 'Upgrade Reminder Day 30', body: "{{user.name}}, don't miss out! Pro members find winning products 3x faster. Upgrade today: {{company.website}}/my-plan", category: 'marketing', type: 'upgrade_reminder_30', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0005-4000-8000-000000000001', name: 'Batch Assigned', body: "{{user.name}}, you've been assigned to Batch {{batch_name}}! Your mentorship journey begins. Check details: {{company.website}}/mentorship", category: 'transactional', type: 'batch_assigned', variables: ['user.name', 'batch_name', 'company.website'], is_active: true },
  { id: 'a1000001-0005-4000-8000-000000000002', name: 'Week Advance Notification', body: '{{user.name}}, Week {{week_number}} of your mentorship is starting! New tasks and goals await. Check in: {{company.website}}/mentorship', category: 'transactional', type: 'week_advance', variables: ['user.name', 'week_number', 'company.website'], is_active: true },
  { id: 'a1000001-0005-4000-8000-000000000003', name: 'POC Contact Info', body: '{{user.name}}, your point of contact is {{poc_name}}. Reach them at {{poc_phone}} for any mentorship questions.', category: 'transactional', type: 'poc_contact', variables: ['user.name', 'poc_name', 'poc_phone'], is_active: true },
  { id: 'a1000001-0005-4000-8000-000000000004', name: 'Session Reminder', body: "Reminder: Your mentorship session is scheduled for {{session_date}} at {{session_time}}. Don't miss it, {{user.name}}!", category: 'transactional', type: 'session_reminder', variables: ['user.name', 'session_date', 'session_time'], is_active: true },
  { id: 'a1000001-0006-4000-8000-000000000001', name: 'Shopify Connected', body: '{{user.name}}, your Shopify store "{{store_name}}" is now connected to USDrop! Start importing winning products: {{company.website}}/my-store', category: 'transactional', type: 'shopify_connected', variables: ['user.name', 'store_name', 'company.website'], is_active: true },
  { id: 'a1000001-0006-4000-8000-000000000002', name: 'Store Claimed', body: '{{user.name}}, your store has been claimed and set up! Time to add products and start selling: {{company.website}}/my-store', category: 'transactional', type: 'store_claimed', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0006-4000-8000-000000000003', name: 'Products Uploaded Milestone', body: "{{user.name}}, you've uploaded {{product_count}} products to your store! You're building a real business. Keep the momentum going!", category: 'marketing', type: 'products_uploaded', variables: ['user.name', 'product_count'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000001', name: 'LLC Application Received', body: "{{user.name}}, we received your LLC application. Our team is processing it and you'll get updates at each step.", category: 'transactional', type: 'llc_received', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000002', name: 'LLC Filed', body: "{{user.name}}, your LLC has been filed with the state! Next step: EIN application. We'll keep you posted.", category: 'transactional', type: 'llc_filed', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000003', name: 'EIN Received', body: '{{user.name}}, your EIN has been received! Next up: BOI filing. Your business is taking shape!', category: 'transactional', type: 'ein_received', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000004', name: 'BOI Filed', body: '{{user.name}}, your BOI report has been filed! Next: opening your business bank account.', category: 'transactional', type: 'boi_filed', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000005', name: 'Bank Account Opened', body: '{{user.name}}, your business bank account is set up! Final step: connecting Stripe for payments.', category: 'transactional', type: 'bank_opened', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000006', name: 'Stripe Connected', body: '{{user.name}}, Stripe is connected! You can now accept payments. Your LLC setup is almost complete.', category: 'transactional', type: 'stripe_connected', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0007-4000-8000-000000000007', name: 'LLC Complete', body: '{{user.name}}, congratulations! Your LLC setup is 100% complete. You are officially ready to do business in the US!', category: 'transactional', type: 'llc_complete', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0008-4000-8000-000000000001', name: '7 Day Inactive', body: 'Hey {{user.name}}, we miss you at USDrop! New winning products are updated daily. Come check them out: {{company.website}}/winning-products', category: 'marketing', type: 'inactive_7', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0008-4000-8000-000000000002', name: '14 Day Inactive', body: "{{user.name}}, it's been 2 weeks! Your competitors are finding winning products daily. Don't fall behind: {{company.website}}/home", category: 'marketing', type: 'inactive_14', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0008-4000-8000-000000000003', name: '30 Day Inactive', body: "{{user.name}}, we haven't seen you in a month. Need help getting back on track? Reply to this message or visit: {{company.website}}/help", category: 'marketing', type: 'inactive_30', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0009-4000-8000-000000000001', name: 'First Month Milestone', body: "{{user.name}}, you've been with USDrop for 1 month! Check your progress and see how far you've come: {{company.website}}/my-roadmap", category: 'marketing', type: 'milestone_1month', variables: ['user.name', 'company.website'], is_active: true },
  { id: 'a1000001-0009-4000-8000-000000000002', name: 'First Sale Celebration', body: 'Congrats on your first sale, {{user.name}}! This is just the beginning. Keep optimizing and scaling your store!', category: 'marketing', type: 'first_sale', variables: ['user.name'], is_active: true },
  { id: 'a1000001-0009-4000-8000-000000000003', name: 'Subscription Renewal Reminder', body: '{{user.name}}, your {{user.plan}} subscription renews on {{renewal_date}}. Ensure uninterrupted access to all features: {{company.website}}/my-plan', category: 'transactional', type: 'renewal_reminder', variables: ['user.name', 'user.plan', 'renewal_date', 'company.website'], is_active: true },
];

const DEFAULT_SMS_AUTOMATIONS: SmsAutomationDefinition[] = [
  { id: 'b1000001-0001-4000-8000-000000000001', name: 'Welcome SMS', description: 'Send welcome SMS on user signup', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0001-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0001-4000-8000-000000000002', name: 'OTP Verification SMS', description: 'Send OTP code for verification', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0001-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0002-4000-8000-000000000001', name: 'Profile Reminder Day 1', description: 'Remind user to complete profile after 1 day', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0002-4000-8000-000000000001', delay: 1, delay_unit: 'days', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0002-4000-8000-000000000002', name: 'Onboarding Nudge Day 3', description: 'Nudge to complete onboarding after 3 days', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0002-4000-8000-000000000002', delay: 3, delay_unit: 'days', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0003-4000-8000-000000000001', name: 'Course Started SMS', description: 'Encourage user when they start a course', trigger: 'course_started', conditions: [], template_id: 'a1000001-0003-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0003-4000-8000-000000000002', name: 'Module Completion SMS', description: 'Congratulate on module completion', trigger: 'lesson_completed', conditions: [], template_id: 'a1000001-0003-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0003-4000-8000-000000000003', name: 'All Lessons Complete SMS', description: 'CTA for mentorship after completing all lessons', trigger: 'course_completed', conditions: [], template_id: 'a1000001-0003-4000-8000-000000000003', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0004-4000-8000-000000000001', name: 'Pro Plan Welcome SMS', description: 'Welcome to Pro plan', trigger: 'plan_upgraded', conditions: [{ id: '1', field: 'plan_slug', operator: 'equals', value: 'pro' }], template_id: 'a1000001-0004-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0004-4000-8000-000000000002', name: 'Elite Plan Welcome SMS', description: 'Welcome to Elite plan', trigger: 'plan_upgraded', conditions: [{ id: '1', field: 'plan_slug', operator: 'equals', value: 'elite' }], template_id: 'a1000001-0004-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0004-4000-8000-000000000003', name: 'Upgrade Reminder Day 14', description: 'Remind free users to upgrade after 14 days', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0004-4000-8000-000000000003', delay: 14, delay_unit: 'days', is_active: true, target_audience: 'plan_based', plan_levels: ['free'] },
  { id: 'b1000001-0004-4000-8000-000000000004', name: 'Upgrade Reminder Day 30', description: 'Remind free users to upgrade after 30 days', trigger: 'user_signup', conditions: [], template_id: 'a1000001-0004-4000-8000-000000000004', delay: 30, delay_unit: 'days', is_active: true, target_audience: 'plan_based', plan_levels: ['free'] },
  { id: 'b1000001-0005-4000-8000-000000000001', name: 'Batch Assigned SMS', description: 'Notify when assigned to a mentorship batch', trigger: 'mentorship_assigned', conditions: [], template_id: 'a1000001-0005-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0005-4000-8000-000000000002', name: 'Week Advance SMS', description: 'Notify mentorship week advancement', trigger: 'mentorship_week_advanced', conditions: [], template_id: 'a1000001-0005-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0005-4000-8000-000000000003', name: 'POC Contact SMS', description: 'Send POC contact info when assigned', trigger: 'mentorship_assigned', conditions: [], template_id: 'a1000001-0005-4000-8000-000000000003', delay: 5, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0005-4000-8000-000000000004', name: 'Session Reminder SMS', description: 'Remind about upcoming mentorship session', trigger: 'custom_event', conditions: [], template_id: 'a1000001-0005-4000-8000-000000000004', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0006-4000-8000-000000000001', name: 'Shopify Connected SMS', description: 'Notify when Shopify store is connected', trigger: 'store_connected', conditions: [], template_id: 'a1000001-0006-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0006-4000-8000-000000000002', name: 'Store Claimed SMS', description: 'Notify when store is claimed', trigger: 'store_claimed', conditions: [], template_id: 'a1000001-0006-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0006-4000-8000-000000000003', name: 'Products Uploaded SMS', description: 'Congratulate on product upload milestone', trigger: 'products_uploaded', conditions: [], template_id: 'a1000001-0006-4000-8000-000000000003', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000001', name: 'LLC Application Received SMS', description: 'Confirm LLC application received', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'received' }], template_id: 'a1000001-0007-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000002', name: 'LLC Filed SMS', description: 'Notify LLC has been filed', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'filed' }], template_id: 'a1000001-0007-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000003', name: 'EIN Received SMS', description: 'Notify EIN received', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'ein_received' }], template_id: 'a1000001-0007-4000-8000-000000000003', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000004', name: 'BOI Filed SMS', description: 'Notify BOI has been filed', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'boi_filed' }], template_id: 'a1000001-0007-4000-8000-000000000004', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000005', name: 'Bank Account Opened SMS', description: 'Notify bank account opened', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'bank_opened' }], template_id: 'a1000001-0007-4000-8000-000000000005', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000006', name: 'Stripe Connected SMS', description: 'Notify Stripe connected', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'stripe_connected' }], template_id: 'a1000001-0007-4000-8000-000000000006', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0007-4000-8000-000000000007', name: 'LLC Complete SMS', description: 'Congratulate on full LLC completion', trigger: 'llc_status_changed', conditions: [{ id: '1', field: 'llc_status', operator: 'equals', value: 'complete' }], template_id: 'a1000001-0007-4000-8000-000000000007', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0008-4000-8000-000000000001', name: '7 Day Inactive SMS', description: 'Re-engage users inactive for 7 days', trigger: 'user_inactive', conditions: [{ id: '1', field: 'inactive_days', operator: 'equals', value: '7' }], template_id: 'a1000001-0008-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0008-4000-8000-000000000002', name: '14 Day Inactive SMS', description: 'Re-engage users inactive for 14 days', trigger: 'user_inactive', conditions: [{ id: '1', field: 'inactive_days', operator: 'equals', value: '14' }], template_id: 'a1000001-0008-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0008-4000-8000-000000000003', name: '30 Day Inactive SMS', description: 'Re-engage users inactive for 30 days', trigger: 'user_inactive', conditions: [{ id: '1', field: 'inactive_days', operator: 'equals', value: '30' }], template_id: 'a1000001-0008-4000-8000-000000000003', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0009-4000-8000-000000000001', name: 'First Month Milestone SMS', description: 'Celebrate 1 month with USDrop', trigger: 'milestone_reached', conditions: [{ id: '1', field: 'milestone_type', operator: 'equals', value: 'first_month' }], template_id: 'a1000001-0009-4000-8000-000000000001', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0009-4000-8000-000000000002', name: 'First Sale Celebration SMS', description: 'Celebrate first sale', trigger: 'milestone_reached', conditions: [{ id: '1', field: 'milestone_type', operator: 'equals', value: 'first_sale' }], template_id: 'a1000001-0009-4000-8000-000000000002', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
  { id: 'b1000001-0009-4000-8000-000000000003', name: 'Renewal Reminder SMS', description: 'Remind about upcoming subscription renewal', trigger: 'custom_event', conditions: [{ id: '1', field: 'event_type', operator: 'equals', value: 'renewal_reminder' }], template_id: 'a1000001-0009-4000-8000-000000000003', delay: 0, delay_unit: 'minutes', is_active: true, target_audience: 'all', plan_levels: [] },
];

export async function seedSmsTemplatesAndAutomations(): Promise<void> {
  try {
    console.log('[sms-automation] Seeding SMS templates...');

    for (const template of DEFAULT_SMS_TEMPLATES) {
      const { error } = await supabaseRemote
        .from('sms_templates')
        .upsert(
          {
            id: template.id,
            name: template.name,
            body: template.body,
            category: template.category,
            type: template.type,
            variables: template.variables,
            is_active: template.is_active,
          },
          { onConflict: 'id' },
        );

      if (error) {
        console.error(`[sms-automation] Failed to seed template "${template.name}":`, error.message);
      }
    }

    console.log(`[sms-automation] Seeded ${DEFAULT_SMS_TEMPLATES.length} SMS templates`);

    console.log('[sms-automation] Seeding SMS automations...');

    for (const automation of DEFAULT_SMS_AUTOMATIONS) {
      const { error } = await supabaseRemote
        .from('sms_automations')
        .upsert(
          {
            id: automation.id,
            name: automation.name,
            description: automation.description,
            trigger: automation.trigger,
            conditions: automation.conditions,
            template_id: automation.template_id,
            delay: automation.delay,
            delay_unit: automation.delay_unit,
            is_active: automation.is_active,
            target_audience: automation.target_audience,
            plan_levels: automation.plan_levels,
          },
          { onConflict: 'id' },
        );

      if (error) {
        console.error(`[sms-automation] Failed to seed automation "${automation.name}":`, error.message);
      }
    }

    console.log(`[sms-automation] Seeded ${DEFAULT_SMS_AUTOMATIONS.length} SMS automations`);
    console.log('[sms-automation] SMS seed complete');
  } catch (error) {
    console.error('[sms-automation] Failed to seed SMS data:', error);
  }
}

export async function triggerSmsAutomation(
  event: SmsAutomationTrigger,
  userId: string,
  metadata: Record<string, any> = {},
) {
  try {
    const { data: automations, error } = await supabaseRemote
      .from('sms_automations')
      .select('*')
      .eq('trigger', event)
      .eq('is_active', true);

    if (error || !automations || automations.length === 0) {
      return;
    }

    for (const automation of automations as SmsAutomationRecord[]) {
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
          executeSmsAutomation(automation, userId, metadata).catch((err) =>
            console.error(`[sms-automation] Delayed execution failed for ${automation.id}:`, err),
          );
        }, delayMs);
      } else {
        executeSmsAutomation(automation, userId, metadata).catch((err) =>
          console.error(`[sms-automation] Immediate execution failed for ${automation.id}:`, err),
        );
      }
    }
  } catch (error) {
    console.error(`[sms-automation] triggerSmsAutomation error for event "${event}":`, error);
  }
}
