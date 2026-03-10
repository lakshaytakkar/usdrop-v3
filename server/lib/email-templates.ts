function baseLayout(content: string, previewText: string = ''): string {
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
  return baseLayout(content, 'Welcome to USDrop AI — your dropshipping journey starts now!')
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
]

export function getDefaultTemplateByName(name: string) {
  return DEFAULT_EMAIL_TEMPLATES.find(t => t.name === name)
}

export function getAllDefaultTemplates() {
  return DEFAULT_EMAIL_TEMPLATES
}
