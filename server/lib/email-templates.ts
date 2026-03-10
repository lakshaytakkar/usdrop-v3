const EMAIL_BANNER_BASE_URL = process.env.EMAIL_BANNER_BASE_URL || 'https://usdrop-v3.replit.app';

function bannerHtml(bannerImage?: string): string {
  if (!bannerImage) return '';
  const url = `${EMAIL_BANNER_BASE_URL}/email-banners/${bannerImage}`;
  return `<div style="margin: 0; padding: 0; line-height: 0;">
    <img src="${url}" alt="" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
  </div>`;
}

function baseLayout(content: string, previewText: string = '', bannerImage?: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>USDrop AI</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F5F7; margin: 0; padding: 0; width: 100%; }
    .email-wrapper { background-color: #F5F5F7; padding: 40px 16px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; }
    .email-header { background-color: #FFFFFF; padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid #E5E7EB; }
    .logo-text { font-size: 24px; font-weight: 700; color: #111827; letter-spacing: -0.5px; }
    .logo-accent { color: #3B82F6; }
    .email-body { padding: 40px; }
    .email-footer { background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB; }
    .email-footer p { font-size: 12px; color: #9CA3AF; line-height: 1.6; margin: 0; }
    .email-footer a { color: #6B7280; text-decoration: underline; }
    h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; line-height: 1.3; }
    h2 { font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 12px; line-height: 1.3; }
    p { font-size: 15px; color: #4B5563; line-height: 1.6; margin: 0 0 16px; }
    .btn { display: inline-block; background-color: #3B82F6; color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px; text-align: center; }
    .btn-secondary { background-color: #F3F4F6; color: #374151; }
    .btn-wrapper { text-align: center; margin: 24px 0; }
    .divider { height: 1px; background-color: #E5E7EB; margin: 24px 0; }
    .info-box { background-color: #F0F7FF; border-radius: 6px; padding: 20px; margin: 16px 0; }
    .info-box p { margin: 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
    .detail-label { font-size: 14px; color: #6B7280; }
    .detail-value { font-size: 14px; color: #111827; font-weight: 500; }
    .muted { color: #9CA3AF; font-size: 13px; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { padding: 16px 8px; }
      .email-header { padding: 24px 20px 16px; }
      .email-body { padding: 24px 20px; }
      .email-footer { padding: 20px; }
      h1 { font-size: 20px; }
      h2 { font-size: 18px; }
      .btn { padding: 12px 24px; font-size: 14px; width: 100%; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#F5F5F7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="email-wrapper">
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center"><tr><td>
    <![endif]-->
    <div class="email-container">
      <div class="email-header">
        <span class="logo-text">USDrop <span class="logo-accent">AI</span></span>
      </div>
      ${bannerHtml(bannerImage)}
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <p>{{company.name}} &mdash; Your Dropshipping Partner</p>
        <p style="margin-top: 8px;">
          <a href="{{company.website}}">Website</a> &nbsp;|&nbsp;
          <a href="mailto:{{company.email}}">Support</a> &nbsp;|&nbsp;
          <a href="{{unsubscribeLink}}">Unsubscribe</a>
        </p>
        <p style="margin-top: 12px;">&copy; ${new Date().getFullYear()} {{company.name}}. All rights reserved.</p>
      </div>
    </div>
    <!--[if mso]>
    </td></tr></table>
    <![endif]-->
  </div>
</body>
</html>`
}

export function welcomeEmailTemplate(): string {
  const content = `
    <h1>Welcome to USDrop AI, {{user.name}}!</h1>
    <p>We're thrilled to have you on board. USDrop AI is your all-in-one platform for building a successful dropshipping business.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Here's what you can do:</p>
      <p style="margin-bottom: 4px;">&#x2022; Discover winning products with AI-powered research</p>
      <p style="margin-bottom: 4px;">&#x2022; Access our curated supplier network</p>
      <p style="margin-bottom: 4px;">&#x2022; Learn from expert-led courses and webinars</p>
      <p style="margin-bottom: 0;">&#x2022; Use AI tools to create ads, descriptions, and more</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Get Started</a>
    </div>
    <p class="muted">You signed up on {{user.signupDate}} with {{user.email}}. If you didn't create this account, please contact our support team.</p>
  `
  return baseLayout(content, 'Welcome to USDrop AI — your dropshipping journey starts now!', 'welcome.png')
}

export function passwordResetTemplate(): string {
  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi {{user.name}},</p>
    <p>We received a request to reset your password. Click the button below to create a new one. This link will expire in 1 hour.</p>
    <div class="btn-wrapper">
      <a href="{{resetLink}}" class="btn" style="color: #FFFFFF;">Reset Password</a>
    </div>
    <div class="divider"></div>
    <p class="muted">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <p class="muted">For security, this request was received on {{currentDate}}. If you're concerned about your account's safety, please contact us at {{company.email}}.</p>
  `
  return baseLayout(content, 'Reset your USDrop AI password')
}

export function planUpgradeTemplate(): string {
  const content = `
    <h1>Your Plan Has Been Upgraded!</h1>
    <p>Hi {{user.name}},</p>
    <p>Great news! Your account has been upgraded to the <strong>{{user.plan}}</strong> plan. Here's what's now available to you:</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Your New Plan Benefits:</p>
      <p style="margin-bottom: 4px;">&#x2022; Unlimited product research</p>
      <p style="margin-bottom: 4px;">&#x2022; Advanced AI tools for ad creation</p>
      <p style="margin-bottom: 4px;">&#x2022; Priority support access</p>
      <p style="margin-bottom: 0;">&#x2022; Exclusive webinars and courses</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Explore Your New Features</a>
    </div>
    <p>Thank you for investing in your dropshipping success. We're here to help you make the most of your upgraded plan.</p>
  `
  return baseLayout(content, 'Your USDrop AI plan has been upgraded!')
}

export function planDowngradeTemplate(): string {
  const content = `
    <h1>Your Plan Has Been Updated</h1>
    <p>Hi {{user.name}},</p>
    <p>We've updated your account as requested. Your current plan is now <strong>{{user.plan}}</strong>.</p>
    <p>We'd love to understand what led to this change. Your feedback helps us improve our platform for everyone.</p>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-plan" class="btn" style="color: #FFFFFF;">Share Feedback</a>
    </div>
    <div class="divider"></div>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Did you know?</p>
      <p style="margin-bottom: 0;">You can upgrade back at any time and instantly regain access to all premium features. If you need help or have questions, our support team is always here for you.</p>
    </div>
    <p class="muted">If you have any concerns or need assistance, reach out to us at {{company.email}}.</p>
  `
  return baseLayout(content, 'Your USDrop AI plan has been updated')
}

export function onboardingDay1Template(): string {
  const content = `
    <h1>Day 1: Let's Set You Up for Success</h1>
    <p>Hi {{user.name}},</p>
    <p>Welcome to your first day with USDrop AI! Let's make sure you're set up to hit the ground running.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Your First Steps:</p>
      <p style="margin-bottom: 4px;"><strong>1.</strong> Complete your profile to personalize your experience</p>
      <p style="margin-bottom: 4px;"><strong>2.</strong> Browse winning products in our curated library</p>
      <p style="margin-bottom: 0;"><strong>3.</strong> Watch our quick-start guide (5 minutes)</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-profile" class="btn" style="color: #FFFFFF;">Complete Your Profile</a>
    </div>
    <p>Need help? Our support team is available to assist you every step of the way.</p>
  `
  return baseLayout(content, 'Your first steps with USDrop AI')
}

export function onboardingDay3Template(): string {
  const content = `
    <h1>Day 3: Find Your First Winning Product</h1>
    <p>Hi {{user.name}},</p>
    <p>You've been with us for a few days now. It's time to discover the products that will drive your business forward.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Today's Focus:</p>
      <p style="margin-bottom: 4px;">&#x2022; Use our AI product research tool to find trending items</p>
      <p style="margin-bottom: 4px;">&#x2022; Check competitor stores for market insights</p>
      <p style="margin-bottom: 0;">&#x2022; Save products to your collection for easy access</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/winning-products" class="btn" style="color: #FFFFFF;">Discover Products</a>
    </div>
    <p>Pro tip: Look for products with high demand and low competition for the best results.</p>
  `
  return baseLayout(content, 'Time to find your first winning product!')
}

export function onboardingDay7Template(): string {
  const content = `
    <h1>Day 7: You're Ready to Scale</h1>
    <p>Hi {{user.name}},</p>
    <p>One week in and you're doing great! It's time to take your dropshipping business to the next level.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Level Up Your Business:</p>
      <p style="margin-bottom: 4px;">&#x2022; Create your first ad campaign with our AI Ad Studio</p>
      <p style="margin-bottom: 4px;">&#x2022; Connect your Shopify store for seamless fulfillment</p>
      <p style="margin-bottom: 4px;">&#x2022; Enroll in our advanced courses for deeper strategies</p>
      <p style="margin-bottom: 0;">&#x2022; Join our community webinars for live Q&amp;A sessions</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Explore All Tools</a>
    </div>
    <p>Remember, consistency is key. Keep learning, keep testing, and the results will follow.</p>
  `
  return baseLayout(content, 'Week 1 complete — time to scale!')
}

export function reEngagementTemplate(): string {
  const content = `
    <h1>We Miss You, {{user.name}}!</h1>
    <p>It's been a while since you last visited USDrop AI. A lot has changed, and we'd love to show you what's new.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What You've Been Missing:</p>
      <p style="margin-bottom: 4px;">&#x2022; New winning products added daily</p>
      <p style="margin-bottom: 4px;">&#x2022; Updated AI tools for better ad creation</p>
      <p style="margin-bottom: 4px;">&#x2022; Fresh courses from industry experts</p>
      <p style="margin-bottom: 0;">&#x2022; Improved supplier network with faster shipping</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Come Back &amp; Explore</a>
    </div>
    <p class="muted">You still have {{user.credits}} credits in your account. Don't let them go to waste!</p>
  `
  return baseLayout(content, 'We miss you! See what\'s new at USDrop AI')
}

export function orderConfirmationTemplate(): string {
  const content = `
    <h1>Order Confirmed!</h1>
    <p>Hi {{user.name}},</p>
    <p>Your order has been placed successfully. Here are your order details:</p>
    <div style="background-color: #F9FAFB; border-radius: 6px; padding: 20px; margin: 16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Order ID</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Date</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.date}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Items</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.items}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Shipping To</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.shippingAddress}}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 0; font-size: 16px; font-weight: 700; color: #111827;">Total</td>
          <td style="padding: 12px 0 0; font-size: 16px; font-weight: 700; color: #3B82F6; text-align: right;">{{order.total}}</td>
        </tr>
      </table>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-products" class="btn" style="color: #FFFFFF;">View Order</a>
    </div>
    <p class="muted">You'll receive a shipping notification with tracking details once your order is on its way.</p>
  `
  return baseLayout(content, 'Your USDrop AI order has been confirmed')
}

export function shippingNotificationTemplate(): string {
  const content = `
    <h1>Your Order Is On Its Way!</h1>
    <p>Hi {{user.name}},</p>
    <p>Great news! Your order <strong>{{order.id}}</strong> has been shipped and is on its way to you.</p>
    <div style="background-color: #F0F7FF; border-radius: 6px; padding: 20px; margin: 16px 0; text-align: center;">
      <p style="font-size: 13px; color: #6B7280; margin: 0 0 4px;">Tracking Number</p>
      <p style="font-size: 18px; font-weight: 700; color: #3B82F6; margin: 0; letter-spacing: 1px;">{{order.trackingNumber}}</p>
    </div>
    <div style="background-color: #F9FAFB; border-radius: 6px; padding: 20px; margin: 16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Order ID</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.id}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #6B7280;">Items</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.items}}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 14px; color: #6B7280;">Delivering To</td>
          <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 500; text-align: right;">{{order.shippingAddress}}</td>
        </tr>
      </table>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-products" class="btn" style="color: #FFFFFF;">Track Your Order</a>
    </div>
    <p class="muted">Delivery times may vary. If you have any questions about your shipment, please contact our support team.</p>
  `
  return baseLayout(content, 'Your USDrop AI order has shipped!')
}

export const DEFAULT_EMAIL_TEMPLATES = [
  {
    name: 'Welcome Email',
    subject: 'Welcome to USDrop AI, {{user.name}}!',
    type: 'utility' as const,
    category: 'welcome' as const,
    description: 'First email sent immediately after user signup to welcome them to the platform',
    htmlContent: welcomeEmailTemplate(),
    variables: ['{{user.name}}', '{{user.email}}', '{{user.signupDate}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Password Reset',
    subject: 'Reset Your Password — USDrop AI',
    type: 'utility' as const,
    category: 'password-reset' as const,
    description: 'Sent when user requests password reset with secure reset link',
    htmlContent: passwordResetTemplate(),
    variables: ['{{user.name}}', '{{resetLink}}', '{{currentDate}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Plan Upgrade Confirmation',
    subject: 'Your Plan Has Been Upgraded — USDrop AI',
    type: 'utility' as const,
    category: 'promotional' as const,
    description: 'Sent when user upgrades plan with new features and benefits',
    htmlContent: planUpgradeTemplate(),
    variables: ['{{user.name}}', '{{user.plan}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Plan Downgrade / Cancellation',
    subject: 'Your Plan Has Been Updated — USDrop AI',
    type: 'utility' as const,
    category: 're-engagement' as const,
    description: 'Sent when user downgrades plan with feedback request and retention offer',
    htmlContent: planDowngradeTemplate(),
    variables: ['{{user.name}}', '{{user.plan}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Onboarding — Day 1',
    subject: 'Day 1: Let\'s Set You Up for Success',
    type: 'marketing' as const,
    category: 'onboarding' as const,
    description: 'First onboarding email sent on day 1 with profile setup steps',
    htmlContent: onboardingDay1Template(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Onboarding — Day 3',
    subject: 'Day 3: Find Your First Winning Product',
    type: 'marketing' as const,
    category: 'onboarding' as const,
    description: 'Second onboarding email sent on day 3 with product discovery tips',
    htmlContent: onboardingDay3Template(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Onboarding — Day 7',
    subject: 'Day 7: You\'re Ready to Scale',
    type: 'marketing' as const,
    category: 'onboarding' as const,
    description: 'Third onboarding email sent on day 7 with scaling strategies',
    htmlContent: onboardingDay7Template(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Re-engagement',
    subject: 'We Miss You, {{user.name}}!',
    type: 'marketing' as const,
    category: 're-engagement' as const,
    description: 'Sent to inactive users to bring them back to the platform',
    htmlContent: reEngagementTemplate(),
    variables: ['{{user.name}}', '{{user.credits}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Order Confirmation',
    subject: 'Order Confirmed — {{order.id}}',
    type: 'utility' as const,
    category: 'order-confirmation' as const,
    description: 'Sent immediately after order placement with order details and receipt',
    htmlContent: orderConfirmationTemplate(),
    variables: ['{{user.name}}', '{{order.id}}', '{{order.date}}', '{{order.items}}', '{{order.total}}', '{{order.shippingAddress}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Shipping Notification',
    subject: 'Your Order {{order.id}} Has Shipped!',
    type: 'utility' as const,
    category: 'shipping-notification' as const,
    description: 'Sent when order is shipped with tracking information',
    htmlContent: shippingNotificationTemplate(),
    variables: ['{{user.name}}', '{{order.id}}', '{{order.items}}', '{{order.shippingAddress}}', '{{order.trackingNumber}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Course Started',
    subject: 'Great Start on {{course.name}}!',
    type: 'marketing' as const,
    category: 'learning' as const,
    description: 'Sent when user starts a new course to encourage continued learning',
    htmlContent: courseStartedTemplate(),
    variables: ['{{user.name}}', '{{course.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Module Completed',
    subject: 'Module Complete — Keep Going, {{user.name}}!',
    type: 'marketing' as const,
    category: 'learning' as const,
    description: 'Sent when user completes a course module to celebrate progress',
    htmlContent: moduleCompletedTemplate(),
    variables: ['{{user.name}}', '{{module.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'All Lessons Complete',
    subject: 'You Completed All Lessons — What\'s Next?',
    type: 'marketing' as const,
    category: 'learning' as const,
    description: 'Sent when user completes all free lessons with mentorship CTA',
    htmlContent: allLessonsCompleteTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Mentorship Batch Assigned',
    subject: 'Welcome to Your Mentorship Batch!',
    type: 'utility' as const,
    category: 'mentorship' as const,
    description: 'Sent when user is assigned to a mentorship batch',
    htmlContent: mentorshipBatchAssignedTemplate(),
    variables: ['{{user.name}}', '{{batch.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Mentorship Week Update',
    subject: 'Week {{week.number}} — Your Mentorship Update',
    type: 'utility' as const,
    category: 'mentorship' as const,
    description: 'Weekly progress update during mentorship program',
    htmlContent: mentorshipWeekUpdateTemplate(),
    variables: ['{{user.name}}', '{{week.number}}', '{{week.description}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Mentorship Session Reminder',
    subject: 'Mentorship Session Reminder — {{session.date}}',
    type: 'utility' as const,
    category: 'mentorship' as const,
    description: 'Reminder before a mentorship session',
    htmlContent: mentorshipSessionReminderTemplate(),
    variables: ['{{user.name}}', '{{session.date}}', '{{session.time}}', '{{session.topic}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Store Connected',
    subject: 'Shopify Store Connected Successfully!',
    type: 'utility' as const,
    category: 'store' as const,
    description: 'Sent when user connects their Shopify store',
    htmlContent: storeConnectedTemplate(),
    variables: ['{{user.name}}', '{{store.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Store Claimed',
    subject: 'Your Store Has Been Claimed!',
    type: 'utility' as const,
    category: 'store' as const,
    description: 'Sent when user claims their store on the platform',
    htmlContent: storeClaimedTemplate(),
    variables: ['{{user.name}}', '{{store.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Products Milestone',
    subject: 'Products Uploaded — Your Store Is Taking Shape!',
    type: 'utility' as const,
    category: 'store' as const,
    description: 'Sent when user uploads products to their store',
    htmlContent: productsMilestoneTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'LLC Application Received',
    subject: 'LLC Application Received — We\'re On It!',
    type: 'utility' as const,
    category: 'llc' as const,
    description: 'Sent when LLC formation application is received',
    htmlContent: llcApplicationReceivedTemplate(),
    variables: ['{{user.name}}', '{{llc.timeline}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'LLC Status Update',
    subject: 'LLC Update: {{llc.status}}',
    type: 'utility' as const,
    category: 'llc' as const,
    description: 'Sent at each LLC formation stage update',
    htmlContent: llcStatusUpdateTemplate(),
    variables: ['{{user.name}}', '{{llc.status}}', '{{llc.statusDescription}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'LLC Complete',
    subject: 'LLC Formation Complete — Congratulations!',
    type: 'utility' as const,
    category: 'llc' as const,
    description: 'Sent when LLC formation is fully complete',
    htmlContent: llcCompleteTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Re-engagement — 7 Day',
    subject: 'We Noticed You\'ve Been Away, {{user.name}}',
    type: 'marketing' as const,
    category: 're-engagement' as const,
    description: 'Sent to users inactive for 7 days',
    htmlContent: reEngagement7DayTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Re-engagement — 14 Day',
    subject: 'Don\'t Let Your Progress Stall, {{user.name}}',
    type: 'marketing' as const,
    category: 're-engagement' as const,
    description: 'Sent to users inactive for 14 days',
    htmlContent: reEngagement14DayTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Re-engagement — 30 Day',
    subject: 'We Miss You, {{user.name}} — Come Back!',
    type: 'marketing' as const,
    category: 're-engagement' as const,
    description: 'Sent to users inactive for 30 days with strong re-engagement pitch',
    htmlContent: reEngagement30DayTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'First Month Milestone',
    subject: 'One Month with USDrop AI — Congratulations!',
    type: 'marketing' as const,
    category: 'retention' as const,
    description: 'Celebrate user completing their first month on the platform',
    htmlContent: firstMonthMilestoneTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'First Sale Celebration',
    subject: 'You Made Your First Sale!',
    type: 'marketing' as const,
    category: 'retention' as const,
    description: 'Celebrate when user makes their first sale',
    htmlContent: firstSaleCelebrationTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: '90-Day Milestone',
    subject: '90 Days Strong, {{user.name}}!',
    type: 'marketing' as const,
    category: 'retention' as const,
    description: 'Celebrate user reaching 90 days on the platform',
    htmlContent: ninetyDayMilestoneTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Renewal Reminder',
    subject: 'Your Subscription Renewal Is Coming Up',
    type: 'utility' as const,
    category: 'retention' as const,
    description: 'Remind user their subscription is up for renewal',
    htmlContent: renewalReminderTemplate(),
    variables: ['{{user.name}}', '{{user.plan}}', '{{renewal.date}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Feature Announcement',
    subject: 'New Feature: {{feature.name}} — Now Available!',
    type: 'marketing' as const,
    category: 'marketing' as const,
    description: 'Announce new platform features to users',
    htmlContent: featureAnnouncementTemplate(),
    variables: ['{{user.name}}', '{{feature.name}}', '{{feature.description}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'New Course Available',
    subject: 'New Course: {{course.name}} — Start Learning!',
    type: 'marketing' as const,
    category: 'marketing' as const,
    description: 'Notify users when a new course is published',
    htmlContent: newCourseAvailableTemplate(),
    variables: ['{{user.name}}', '{{course.name}}', '{{course.description}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Referral Invite',
    subject: 'Share USDrop AI — Earn Rewards!',
    type: 'marketing' as const,
    category: 'marketing' as const,
    description: 'Invite users to refer friends to the platform',
    htmlContent: referralInviteTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
  {
    name: 'Onboarding Completed',
    subject: 'Onboarding Complete — Let\'s Go!',
    type: 'utility' as const,
    category: 'onboarding' as const,
    description: 'Sent when user completes onboarding with next steps',
    htmlContent: onboardingCompletedTemplate(),
    variables: ['{{user.name}}', '{{company.name}}', '{{company.email}}', '{{company.website}}', '{{unsubscribeLink}}'],
  },
]

export function courseStartedTemplate(): string {
  const content = `
    <h1>Great Start, {{user.name}}!</h1>
    <p>You've just started the course <strong>{{course.name}}</strong>. That's a great first step toward building your dropshipping business.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Tips for Success:</p>
      <p style="margin-bottom: 4px;">&#x2022; Set aside dedicated learning time each day</p>
      <p style="margin-bottom: 4px;">&#x2022; Take notes on key strategies and action items</p>
      <p style="margin-bottom: 0;">&#x2022; Complete each module before moving to the next</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/free-learning" class="btn" style="color: #FFFFFF;">Continue Learning</a>
    </div>
    <p>Consistency is everything. Even 15 minutes a day adds up quickly.</p>
  `;
  return baseLayout(content, 'You started a new course on USDrop AI!');
}

export function moduleCompletedTemplate(): string {
  const content = `
    <h1>Module Complete!</h1>
    <p>Hi {{user.name}},</p>
    <p>Congratulations on completing <strong>{{module.name}}</strong>! You're making real progress.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Your Progress:</p>
      <p style="margin-bottom: 4px;">&#x2022; Module completed: {{module.name}}</p>
      <p style="margin-bottom: 0;">&#x2022; Keep the momentum going with the next lesson</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/free-learning" class="btn" style="color: #FFFFFF;">Next Lesson</a>
    </div>
    <p>You're building the knowledge that will power your business. Keep going!</p>
  `;
  return baseLayout(content, 'You completed a module — keep going!');
}

export function allLessonsCompleteTemplate(): string {
  const content = `
    <h1>You Did It, {{user.name}}!</h1>
    <p>You've completed all the free learning modules. That's a huge achievement and shows real commitment to your dropshipping success.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Ready for the Next Level?</p>
      <p style="margin-bottom: 4px;">&#x2022; Get 1-on-1 mentorship from industry experts</p>
      <p style="margin-bottom: 4px;">&#x2022; Receive a personalized business roadmap</p>
      <p style="margin-bottom: 4px;">&#x2022; Access exclusive tools and resources</p>
      <p style="margin-bottom: 0;">&#x2022; Join a cohort of driven entrepreneurs</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/mentorship" class="btn" style="color: #FFFFFF;">Explore Mentorship</a>
    </div>
    <p>Our mentorship program has helped hundreds of students launch and scale profitable stores. You could be next.</p>
  `;
  return baseLayout(content, 'All lessons complete — unlock mentorship!');
}

export function mentorshipBatchAssignedTemplate(): string {
  const content = `
    <h1>Welcome to Your Mentorship Batch!</h1>
    <p>Hi {{user.name}},</p>
    <p>You've been assigned to <strong>{{batch.name}}</strong>. Your mentorship journey is about to begin!</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What to Expect:</p>
      <p style="margin-bottom: 4px;">&#x2022; Your POC (Point of Contact) will reach out shortly</p>
      <p style="margin-bottom: 4px;">&#x2022; Weekly sessions with actionable tasks</p>
      <p style="margin-bottom: 4px;">&#x2022; Direct access to your mentor for questions</p>
      <p style="margin-bottom: 0;">&#x2022; Step-by-step guidance through store setup and launch</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-roadmap" class="btn" style="color: #FFFFFF;">View Your Roadmap</a>
    </div>
    <p>Stay engaged and complete each week's tasks for the best results.</p>
  `;
  return baseLayout(content, 'You have been assigned to a mentorship batch!');
}

export function mentorshipWeekUpdateTemplate(): string {
  const content = `
    <h1>Week {{week.number}} Update</h1>
    <p>Hi {{user.name}},</p>
    <p>You've advanced to <strong>Week {{week.number}}</strong> of your mentorship. Here's what's ahead:</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">This Week's Focus:</p>
      <p style="margin-bottom: 0;">{{week.description}}</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-roadmap" class="btn" style="color: #FFFFFF;">View This Week's Tasks</a>
    </div>
    <p>Consistency is key. Complete your tasks and reach out to your POC if you need help.</p>
  `;
  return baseLayout(content, 'Your mentorship week update');
}

export function mentorshipSessionReminderTemplate(): string {
  const content = `
    <h1>Session Reminder</h1>
    <p>Hi {{user.name}},</p>
    <p>You have a mentorship session coming up:</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Session Details:</p>
      <p style="margin-bottom: 4px;">&#x2022; Date: {{session.date}}</p>
      <p style="margin-bottom: 4px;">&#x2022; Time: {{session.time}}</p>
      <p style="margin-bottom: 0;">&#x2022; Topic: {{session.topic}}</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-sessions" class="btn" style="color: #FFFFFF;">View Session Details</a>
    </div>
    <p>Come prepared with questions and make the most of your time with your mentor.</p>
  `;
  return baseLayout(content, 'Your mentorship session is coming up');
}

export function storeConnectedTemplate(): string {
  const content = `
    <h1>Shopify Store Connected!</h1>
    <p>Hi {{user.name}},</p>
    <p>Your Shopify store <strong>{{store.name}}</strong> has been successfully connected to USDrop AI.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Next Steps:</p>
      <p style="margin-bottom: 4px;">&#x2022; Import winning products to your store</p>
      <p style="margin-bottom: 4px;">&#x2022; Set up your store branding and theme</p>
      <p style="margin-bottom: 4px;">&#x2022; Configure payment and shipping settings</p>
      <p style="margin-bottom: 0;">&#x2022; Use our CRO checklist to optimize conversions</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-store" class="btn" style="color: #FFFFFF;">Manage Your Store</a>
    </div>
    <p>A well-set-up store is the foundation of a profitable business.</p>
  `;
  return baseLayout(content, 'Your Shopify store is connected!');
}

export function storeClaimedTemplate(): string {
  const content = `
    <h1>Your Store Has Been Claimed!</h1>
    <p>Hi {{user.name}},</p>
    <p>Congratulations! Your store <strong>{{store.name}}</strong> has been claimed and is ready for business.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Get Started:</p>
      <p style="margin-bottom: 4px;">&#x2022; Add your first products from our winning products library</p>
      <p style="margin-bottom: 4px;">&#x2022; Customize your store's look and feel</p>
      <p style="margin-bottom: 0;">&#x2022; Set up your payment gateway</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-store" class="btn" style="color: #FFFFFF;">Go to Your Store</a>
    </div>
    <p>You're one step closer to your first sale!</p>
  `;
  return baseLayout(content, 'Your store has been claimed!');
}

export function productsMilestoneTemplate(): string {
  const content = `
    <h1>Products Uploaded!</h1>
    <p>Hi {{user.name}},</p>
    <p>You've uploaded products to your store. Your business is taking shape!</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Optimize for Sales:</p>
      <p style="margin-bottom: 4px;">&#x2022; Use our AI Description Generator for compelling product copy</p>
      <p style="margin-bottom: 4px;">&#x2022; Check competitor pricing to stay competitive</p>
      <p style="margin-bottom: 4px;">&#x2022; Add high-quality images using AI Image Studio</p>
      <p style="margin-bottom: 0;">&#x2022; Run our CRO checklist on your product pages</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-products" class="btn" style="color: #FFFFFF;">View Your Products</a>
    </div>
    <p>Well-optimized product listings convert significantly better. Take time to polish each one.</p>
  `;
  return baseLayout(content, 'Your products are live!');
}

export function llcApplicationReceivedTemplate(): string {
  const content = `
    <h1>LLC Application Received</h1>
    <p>Hi {{user.name}},</p>
    <p>We've received your LLC formation application. Our team is on it!</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What Happens Next:</p>
      <p style="margin-bottom: 4px;">&#x2022; Our team reviews your application details</p>
      <p style="margin-bottom: 4px;">&#x2022; We file the necessary paperwork with the state</p>
      <p style="margin-bottom: 4px;">&#x2022; You'll receive updates at each stage</p>
      <p style="margin-bottom: 0;">&#x2022; Expected timeline: {{llc.timeline}}</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-llc" class="btn" style="color: #FFFFFF;">Track Your LLC</a>
    </div>
    <p>Forming an LLC is an important step in legitimizing and protecting your business.</p>
  `;
  return baseLayout(content, 'Your LLC application has been received');
}

export function llcStatusUpdateTemplate(): string {
  const content = `
    <h1>LLC Status Update</h1>
    <p>Hi {{user.name}},</p>
    <p>There's an update on your LLC formation:</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Current Status: {{llc.status}}</p>
      <p style="margin-bottom: 0;">{{llc.statusDescription}}</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-llc" class="btn" style="color: #FFFFFF;">View Full Details</a>
    </div>
    <p>We'll keep you updated as your LLC progresses through each stage. If you have questions, reach out to our support team.</p>
  `;
  return baseLayout(content, 'Your LLC formation status has been updated');
}

export function llcCompleteTemplate(): string {
  const content = `
    <h1>LLC Formation Complete!</h1>
    <p>Hi {{user.name}},</p>
    <p>Congratulations! Your LLC formation is fully complete. You're now operating as a legitimate US business entity.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Completed Steps:</p>
      <p style="margin-bottom: 4px;">&#x2022; LLC Filed with the State</p>
      <p style="margin-bottom: 4px;">&#x2022; EIN Received from the IRS</p>
      <p style="margin-bottom: 4px;">&#x2022; BOI Report Filed</p>
      <p style="margin-bottom: 4px;">&#x2022; Business Bank Account Opened</p>
      <p style="margin-bottom: 0;">&#x2022; Stripe Payment Processing Connected</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-llc" class="btn" style="color: #FFFFFF;">View Your LLC Details</a>
    </div>
    <p>With your business foundation in place, you're ready to scale with confidence.</p>
  `;
  return baseLayout(content, 'Your LLC is fully formed!');
}

export function reEngagement7DayTemplate(): string {
  const content = `
    <h1>We Noticed You've Been Away, {{user.name}}</h1>
    <p>It's been a week since your last visit to USDrop AI. Your dropshipping journey is waiting for you!</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Quick Wins to Get Back on Track:</p>
      <p style="margin-bottom: 4px;">&#x2022; Check out this week's new winning products</p>
      <p style="margin-bottom: 4px;">&#x2022; Continue your learning modules where you left off</p>
      <p style="margin-bottom: 0;">&#x2022; Browse competitor stores for fresh inspiration</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Jump Back In</a>
    </div>
    <p>Even 10 minutes today can move your business forward.</p>
  `;
  return baseLayout(content, 'It has been a week — come back to USDrop AI');
}

export function reEngagement14DayTemplate(): string {
  const content = `
    <h1>Don't Let Your Progress Stall, {{user.name}}</h1>
    <p>Two weeks have passed since your last visit. The dropshipping market moves fast, and we don't want you to fall behind.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What's New Since You've Been Gone:</p>
      <p style="margin-bottom: 4px;">&#x2022; New trending products added to our library</p>
      <p style="margin-bottom: 4px;">&#x2022; Updated AI tools for faster research</p>
      <p style="margin-bottom: 0;">&#x2022; Fresh course content from industry experts</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">See What's New</a>
    </div>
    <p>Your account is ready and waiting. Pick up right where you left off.</p>
  `;
  return baseLayout(content, 'Two weeks away — see what you have missed');
}

export function reEngagement30DayTemplate(): string {
  const content = `
    <h1>We Miss You, {{user.name}}</h1>
    <p>It's been a month since you last logged in. We understand that life gets busy, but your dropshipping goals are still achievable.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Here's Why Now Is a Great Time to Return:</p>
      <p style="margin-bottom: 4px;">&#x2022; The platform has been updated with powerful new features</p>
      <p style="margin-bottom: 4px;">&#x2022; New winning products are trending right now</p>
      <p style="margin-bottom: 4px;">&#x2022; Our support team is standing by to help you restart</p>
      <p style="margin-bottom: 0;">&#x2022; Your account and all your saved data are intact</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Restart Your Journey</a>
    </div>
    <p>Many successful dropshippers took breaks along the way. What matters is getting back in the game.</p>
  `;
  return baseLayout(content, 'It has been a month — your journey awaits');
}

export function firstMonthMilestoneTemplate(): string {
  const content = `
    <h1>One Month with USDrop AI!</h1>
    <p>Hi {{user.name}},</p>
    <p>You've been on the platform for one month! Thank you for choosing USDrop AI as your dropshipping partner.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Your First Month Recap:</p>
      <p style="margin-bottom: 4px;">&#x2022; Keep building on the foundation you've created</p>
      <p style="margin-bottom: 4px;">&#x2022; Explore tools you haven't tried yet</p>
      <p style="margin-bottom: 0;">&#x2022; Consider upgrading your plan for advanced features</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Keep Going</a>
    </div>
    <p>The first month is always the hardest. You've proven your commitment — now it's time to accelerate.</p>
  `;
  return baseLayout(content, 'Congratulations on your first month!');
}

export function firstSaleCelebrationTemplate(): string {
  const content = `
    <h1>You Made Your First Sale!</h1>
    <p>Hi {{user.name}},</p>
    <p>This is a huge milestone! You've made your first sale on your dropshipping store. You're officially a business owner generating revenue.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What's Next:</p>
      <p style="margin-bottom: 4px;">&#x2022; Analyze what worked and double down on it</p>
      <p style="margin-bottom: 4px;">&#x2022; Scale your winning ads with higher budgets</p>
      <p style="margin-bottom: 4px;">&#x2022; Add more products to diversify revenue</p>
      <p style="margin-bottom: 0;">&#x2022; Use our profit calculator to optimize margins</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Scale Your Success</a>
    </div>
    <p>Your first sale proves the model works. Now it's time to scale!</p>
  `;
  return baseLayout(content, 'You made your first sale!');
}

export function ninetyDayMilestoneTemplate(): string {
  const content = `
    <h1>90 Days Strong, {{user.name}}!</h1>
    <p>Three months on USDrop AI — that's impressive dedication. You've put in the work, and it shows.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Level Up for the Next 90 Days:</p>
      <p style="margin-bottom: 4px;">&#x2022; Review and optimize your best-performing products</p>
      <p style="margin-bottom: 4px;">&#x2022; Explore advanced advertising strategies</p>
      <p style="margin-bottom: 4px;">&#x2022; Consider forming an LLC to protect your business</p>
      <p style="margin-bottom: 0;">&#x2022; Connect with fellow entrepreneurs in our community</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Keep Building</a>
    </div>
    <p>90 days is just the beginning. The best is yet to come.</p>
  `;
  return baseLayout(content, '90 days on USDrop AI — keep going!');
}

export function renewalReminderTemplate(): string {
  const content = `
    <h1>Your Subscription Is Up for Renewal</h1>
    <p>Hi {{user.name}},</p>
    <p>Your <strong>{{user.plan}}</strong> subscription will renew on <strong>{{renewal.date}}</strong>.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Your Plan Includes:</p>
      <p style="margin-bottom: 4px;">&#x2022; Full access to winning products and research tools</p>
      <p style="margin-bottom: 4px;">&#x2022; AI-powered ad creation and optimization</p>
      <p style="margin-bottom: 4px;">&#x2022; Expert courses and live webinars</p>
      <p style="margin-bottom: 0;">&#x2022; Priority support from our team</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/my-plan" class="btn" style="color: #FFFFFF;">Manage Subscription</a>
    </div>
    <p class="muted">If you have any questions about your renewal, please contact us at {{company.email}}.</p>
  `;
  return baseLayout(content, 'Your subscription renewal is coming up');
}

export function featureAnnouncementTemplate(): string {
  const content = `
    <h1>New Feature Alert!</h1>
    <p>Hi {{user.name}},</p>
    <p>We're excited to announce a new feature on USDrop AI: <strong>{{feature.name}}</strong></p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">What's New:</p>
      <p style="margin-bottom: 0;">{{feature.description}}</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Try It Now</a>
    </div>
    <p>We're constantly improving the platform based on your feedback. Keep the suggestions coming!</p>
  `;
  return baseLayout(content, 'A new feature is available on USDrop AI');
}

export function newCourseAvailableTemplate(): string {
  const content = `
    <h1>New Course Available!</h1>
    <p>Hi {{user.name}},</p>
    <p>A new course has just been published: <strong>{{course.name}}</strong></p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Course Details:</p>
      <p style="margin-bottom: 4px;">&#x2022; {{course.description}}</p>
      <p style="margin-bottom: 0;">&#x2022; Start learning at your own pace</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/free-learning" class="btn" style="color: #FFFFFF;">Start Course</a>
    </div>
    <p>Continuous learning is the key to staying ahead in dropshipping.</p>
  `;
  return baseLayout(content, 'A new course is available for you');
}

export function referralInviteTemplate(): string {
  const content = `
    <h1>Share USDrop AI, Earn Rewards!</h1>
    <p>Hi {{user.name}},</p>
    <p>Love using USDrop AI? Invite your friends and earn rewards when they sign up!</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">How It Works:</p>
      <p style="margin-bottom: 4px;">&#x2022; Share your unique referral link with friends</p>
      <p style="margin-bottom: 4px;">&#x2022; They get a special welcome bonus when they join</p>
      <p style="margin-bottom: 0;">&#x2022; You earn rewards for each successful referral</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Get Your Referral Link</a>
    </div>
    <p>The more people you help start their dropshipping journey, the more you earn.</p>
  `;
  return baseLayout(content, 'Invite friends and earn rewards');
}

export function onboardingCompletedTemplate(): string {
  const content = `
    <h1>Onboarding Complete!</h1>
    <p>Hi {{user.name}},</p>
    <p>You've completed your onboarding. Your profile is set up and you're ready to make the most of USDrop AI.</p>
    <div class="info-box">
      <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Recommended Next Steps:</p>
      <p style="margin-bottom: 4px;">&#x2022; Browse winning products to find your niche</p>
      <p style="margin-bottom: 4px;">&#x2022; Start the free learning modules</p>
      <p style="margin-bottom: 4px;">&#x2022; Research competitor stores for inspiration</p>
      <p style="margin-bottom: 0;">&#x2022; Explore our AI-powered tools</p>
    </div>
    <div class="btn-wrapper">
      <a href="{{company.website}}/home" class="btn" style="color: #FFFFFF;">Go to Dashboard</a>
    </div>
    <p>Your dropshipping journey is officially underway. Let's make it a success!</p>
  `;
  return baseLayout(content, 'Your onboarding is complete!');
}

export function otpVerificationTemplate(): string {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi {{user.name}},</p>
    <p>Use the verification code below to complete your sign-up. This code expires in 10 minutes.</p>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; background-color: #F0F7FF; border: 2px dashed #3B82F6; border-radius: 8px; padding: 20px 40px;">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #111827; font-family: 'DM Sans', monospace;">{{otp.code}}</span>
      </div>
    </div>
    <p class="muted" style="text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
    <div class="divider"></div>
    <p class="muted">For security, never share this code with anyone. USDrop AI will never ask for your verification code.</p>
  `
  return baseLayout(content, 'Your USDrop AI verification code')
}

export function getDefaultTemplateByName(name: string) {
  return DEFAULT_EMAIL_TEMPLATES.find(t => t.name === name)
}

export function getAllDefaultTemplates() {
  return DEFAULT_EMAIL_TEMPLATES
}
