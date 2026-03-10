import { type Express, Request, Response } from 'express';
import { requireAdmin } from '../lib/auth';
import { sendEmail } from '../lib/resend';
import { sendSms, sendWhatsApp } from '../lib/twilio';
import { DEFAULT_EMAIL_TEMPLATES } from '../lib/email-templates';

const DEFAULT_SMS_TEMPLATES = [
  { name: 'Welcome SMS', body: 'Welcome to USDrop AI, Lakshay! Your dropshipping journey starts now. Log in at https://usdrop.ai to begin.' },
  { name: 'OTP Verification', body: 'Your USDrop verification code is 123456. It expires in 10 minutes. Do not share this code.' },
  { name: 'Profile Reminder Day 1', body: 'Hey Lakshay, complete your USDrop profile to unlock personalized product recommendations. It takes 2 min: https://usdrop.ai/my-profile' },
  { name: 'Complete Onboarding Nudge Day 3', body: "Lakshay, you're almost there! Finish onboarding to access winning products, supplier connections & more. https://usdrop.ai/home" },
  { name: 'Course Started Encouragement', body: 'Great start, Lakshay! You just began "Dropshipping Masterclass". Stay consistent and you\'ll master dropshipping in no time.' },
  { name: 'Module Completion Congrats', body: 'Congrats Lakshay! You completed the "Product Research" module. Keep going - knowledge is your competitive edge!' },
  { name: 'All Lessons Complete + Mentorship CTA', body: 'Lakshay, you finished all free lessons! Ready for 1-on-1 mentorship to accelerate your success? Explore plans: https://usdrop.ai/mentorship' },
  { name: 'Pro Plan Welcome', body: "Welcome to Pro, Lakshay! You now have access to winning products, supplier contacts & more. Let's build your empire: https://usdrop.ai/home" },
  { name: 'Elite Plan Welcome', body: "Welcome to Elite, Lakshay! You've unlocked everything - mentorship, priority support & advanced tools. Your dedicated team awaits: https://usdrop.ai/home" },
  { name: 'Upgrade Reminder Day 14', body: "Lakshay, you've been exploring USDrop for 2 weeks! Upgrade to Pro to unlock winning products & supplier connections: https://usdrop.ai/my-plan" },
  { name: 'Upgrade Reminder Day 30', body: "Lakshay, don't miss out! Pro members find winning products 3x faster. Upgrade today: https://usdrop.ai/my-plan" },
  { name: 'Batch Assigned', body: "Lakshay, you've been assigned to Batch Alpha! Your mentorship journey begins. Check details: https://usdrop.ai/mentorship" },
  { name: 'Week Advance Notification', body: 'Lakshay, Week 2 of your mentorship is starting! New tasks and goals await. Check in: https://usdrop.ai/mentorship' },
  { name: 'POC Contact Info', body: 'Lakshay, your point of contact is Rahul. Reach them at +919999999999 for any mentorship questions.' },
  { name: 'Session Reminder', body: "Reminder: Your mentorship session is scheduled for March 15 at 3:00 PM. Don't miss it, Lakshay!" },
  { name: 'Shopify Connected', body: 'Lakshay, your Shopify store "MyDropStore" is now connected to USDrop! Start importing winning products: https://usdrop.ai/my-store' },
  { name: 'Store Claimed', body: 'Lakshay, your store has been claimed and set up! Time to add products and start selling: https://usdrop.ai/my-store' },
  { name: 'Products Uploaded Milestone', body: "Lakshay, you've uploaded 10 products to your store! You're building a real business. Keep the momentum going!" },
  { name: 'LLC Application Received', body: "Lakshay, we received your LLC application. Our team is processing it and you'll get updates at each step." },
  { name: 'LLC Filed', body: "Lakshay, your LLC has been filed with the state! Next step: EIN application. We'll keep you posted." },
  { name: 'EIN Received', body: 'Lakshay, your EIN has been received! Next up: BOI filing. Your business is taking shape!' },
  { name: 'BOI Filed', body: 'Lakshay, your BOI report has been filed! Next: opening your business bank account.' },
  { name: 'Bank Account Opened', body: 'Lakshay, your business bank account is set up! Final step: connecting Stripe for payments.' },
  { name: 'Stripe Connected', body: 'Lakshay, Stripe is connected! You can now accept payments. Your LLC setup is almost complete.' },
  { name: 'LLC Complete', body: 'Lakshay, congratulations! Your LLC setup is 100% complete. You are officially ready to do business in the US!' },
  { name: '7 Day Inactive', body: 'Hey Lakshay, we miss you at USDrop! New winning products are updated daily. Come check them out: https://usdrop.ai/winning-products' },
  { name: '14 Day Inactive', body: "Lakshay, it's been 2 weeks! Your competitors are finding winning products daily. Don't fall behind: https://usdrop.ai/home" },
  { name: '30 Day Inactive', body: "Lakshay, we haven't seen you in a month. Need help getting back on track? Reply to this message or visit: https://usdrop.ai/help" },
  { name: 'First Month Milestone', body: "Lakshay, you've been with USDrop for 1 month! Check your progress and see how far you've come: https://usdrop.ai/my-roadmap" },
  { name: 'First Sale Celebration', body: 'Congrats on your first sale, Lakshay! This is just the beginning. Keep optimizing and scaling your store!' },
  { name: 'Subscription Renewal Reminder', body: 'Lakshay, your Pro subscription renews on April 10, 2026. Ensure uninterrupted access to all features: https://usdrop.ai/my-plan' },
];

function replaceTestVars(text: string): string {
  return text
    .replace(/\{\{user\.name\}\}/g, 'Lakshay')
    .replace(/\{\{user\.email\}\}/g, 'lakshaytakkar01@gmail.com')
    .replace(/\{\{user\.plan\}\}/g, 'Pro')
    .replace(/\{\{user\.signupDate\}\}/g, 'March 10, 2026')
    .replace(/\{\{company\.name\}\}/g, 'USDrop AI')
    .replace(/\{\{company\.email\}\}/g, 'admin@usdrop.ai')
    .replace(/\{\{company\.website\}\}/g, 'https://usdrop.ai')
    .replace(/\{\{unsubscribeLink\}\}/g, '#')
    .replace(/\{\{resetLink\}\}/g, 'https://usdrop.ai/reset-password?token=test123')
    .replace(/\{\{currentDate\}\}/g, 'March 10, 2026')
    .replace(/\{\{order\.id\}\}/g, 'ORD-2026-001')
    .replace(/\{\{order\.date\}\}/g, 'March 10, 2026')
    .replace(/\{\{order\.items\}\}/g, 'Sample Product x1')
    .replace(/\{\{order\.total\}\}/g, '$49.99')
    .replace(/\{\{order\.shippingAddress\}\}/g, '123 Test St, New York, NY')
    .replace(/\{\{order\.trackingNumber\}\}/g, 'TRK123456789')
    .replace(/\{\{course\.name\}\}/g, 'Dropshipping Masterclass')
    .replace(/\{\{course\.description\}\}/g, 'Learn the fundamentals of dropshipping')
    .replace(/\{\{module\.name\}\}/g, 'Product Research')
    .replace(/\{\{batch\.name\}\}/g, 'Batch Alpha')
    .replace(/\{\{week\.number\}\}/g, '2')
    .replace(/\{\{week\.description\}\}/g, 'Product Research & Niche Selection')
    .replace(/\{\{session\.date\}\}/g, 'March 15, 2026')
    .replace(/\{\{session\.time\}\}/g, '3:00 PM IST')
    .replace(/\{\{session\.topic\}\}/g, 'Store Setup & Optimization')
    .replace(/\{\{store\.name\}\}/g, 'MyDropStore')
    .replace(/\{\{llc\.status\}\}/g, 'Filed')
    .replace(/\{\{llc\.statusDescription\}\}/g, 'Your LLC has been filed with the state')
    .replace(/\{\{llc\.timeline\}\}/g, '2-3 weeks')
    .replace(/\{\{feature\.name\}\}/g, 'AI Product Finder')
    .replace(/\{\{feature\.description\}\}/g, 'Find winning products using AI')
    .replace(/\{\{renewal\.date\}\}/g, 'April 10, 2026')
    .replace(/\{\{user\.credits\}\}/g, '50')
    .replace(/\{\{[^}]+\}\}/g, '[test-value]');
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function registerTestCommsRoutes(app: Express) {
  app.post('/api/admin/test-comms/send-all-emails', requireAdmin, async (_req: Request, res: Response) => {
    const targetEmail = 'lakshaytakkar01@gmail.com';
    const results: { name: string; status: string; error?: string }[] = [];

    try {
      for (let i = 0; i < DEFAULT_EMAIL_TEMPLATES.length; i++) {
        const template = DEFAULT_EMAIL_TEMPLATES[i];
        try {
          const subject = replaceTestVars(template.subject);
          const html = replaceTestVars(template.htmlContent);
          await sendEmail(targetEmail, `[${i + 1}/${DEFAULT_EMAIL_TEMPLATES.length}] ${subject}`, html);
          results.push({ name: template.name, status: 'sent' });
          console.log(`[test-email] ${i + 1}/${DEFAULT_EMAIL_TEMPLATES.length} Sent: ${template.name}`);
        } catch (err: any) {
          results.push({ name: template.name, status: 'failed', error: err.message });
          console.error(`[test-email] Failed: ${template.name}`, err.message);
        }
        if (i < DEFAULT_EMAIL_TEMPLATES.length - 1) {
          await delay(1000);
        }
      }

      const sent = results.filter(r => r.status === 'sent').length;
      const failed = results.filter(r => r.status === 'failed').length;
      return res.json({
        message: `Sent ${sent} emails, ${failed} failed`,
        total: DEFAULT_EMAIL_TEMPLATES.length,
        sent,
        failed,
        results,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/test-comms/send-all-sms', requireAdmin, async (_req: Request, res: Response) => {
    const targetPhone = '+918059153883';
    const results: { name: string; status: string; error?: string }[] = [];

    try {
      for (let i = 0; i < DEFAULT_SMS_TEMPLATES.length; i++) {
        const template = DEFAULT_SMS_TEMPLATES[i];
        try {
          await sendSms(targetPhone, `[${i + 1}/${DEFAULT_SMS_TEMPLATES.length}] ${template.name}\n\n${template.body}`);
          results.push({ name: template.name, status: 'sent' });
          console.log(`[test-sms] ${i + 1}/${DEFAULT_SMS_TEMPLATES.length} Sent: ${template.name}`);
        } catch (err: any) {
          results.push({ name: template.name, status: 'failed', error: err.message });
          console.error(`[test-sms] Failed: ${template.name}`, err.message);
        }
        if (i < DEFAULT_SMS_TEMPLATES.length - 1) {
          await delay(1500);
        }
      }

      const sent = results.filter(r => r.status === 'sent').length;
      const failed = results.filter(r => r.status === 'failed').length;
      return res.json({
        message: `Sent ${sent} SMS, ${failed} failed`,
        total: DEFAULT_SMS_TEMPLATES.length,
        sent,
        failed,
        results,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/test-comms/send-all-whatsapp', requireAdmin, async (_req: Request, res: Response) => {
    const targetWhatsApp = '+919138290396';
    const results: { name: string; status: string; error?: string }[] = [];

    try {
      for (let i = 0; i < DEFAULT_SMS_TEMPLATES.length; i++) {
        const template = DEFAULT_SMS_TEMPLATES[i];
        try {
          await sendWhatsApp(targetWhatsApp, `*[${i + 1}/${DEFAULT_SMS_TEMPLATES.length}] ${template.name}*\n\n${template.body}`);
          results.push({ name: template.name, status: 'sent' });
          console.log(`[test-whatsapp] ${i + 1}/${DEFAULT_SMS_TEMPLATES.length} Sent: ${template.name}`);
        } catch (err: any) {
          results.push({ name: template.name, status: 'failed', error: err.message });
          console.error(`[test-whatsapp] Failed: ${template.name}`, err.message);
        }
        if (i < DEFAULT_SMS_TEMPLATES.length - 1) {
          await delay(1500);
        }
      }

      const sent = results.filter(r => r.status === 'sent').length;
      const failed = results.filter(r => r.status === 'failed').length;
      return res.json({
        message: `Sent ${sent} WhatsApp messages, ${failed} failed`,
        total: DEFAULT_SMS_TEMPLATES.length,
        sent,
        failed,
        results,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });
}
