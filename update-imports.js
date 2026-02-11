const fs = require('fs');
const path = require('path');

// Import replacements map
const replacements = [
  // Layout components
  ['@/components/app-sidebar', '@/components/layout/app-sidebar'],
  ['@/components/topbar', '@/components/layout/topbar'],
  ['@/components/logo', '@/components/layout/logo'],
  ['@/components/sidebar-credits-footer', '@/components/layout/sidebar-credits-footer'],
  ['@/components/sidebar-onboarding-badge', '@/components/layout/sidebar-onboarding-badge'],
  ['@/components/sidebar-picklist-badge', '@/components/layout/sidebar-picklist-badge'],

  // Auth components
  ['@/components/login-form', '@/components/auth/login-form'],
  ['@/components/signup-form', '@/components/auth/signup-form'],
  ['@/components/forgot-password-form', '@/components/auth/forgot-password-form'],
  ['@/components/reset-password-form', '@/components/auth/reset-password-form'],
  ['@/components/otp-login-form', '@/components/auth/otp-login-form'],
  ['@/components/otp-verification-form', '@/components/auth/otp-verification-form'],
  ['@/components/otp-input', '@/components/auth/otp-input'],

  // Chat components
  ['@/components/ai-chatbot-dialog', '@/components/chat/ai-chatbot-dialog'],
  ['@/components/chatbot-bubble', '@/components/chat/chatbot-bubble'],
  ['@/components/chatbot-dialog', '@/components/chat/chatbot-dialog'],
  ['@/components/conditional-chatbot-bubble', '@/components/chat/conditional-chatbot-bubble'],

  // Feedback - banners
  ['@/components/verify-email-banner', '@/components/feedback/banners/verify-email-banner'],
  ['@/components/banner-carousel', '@/components/feedback/banners/banner-carousel'],
  ['@/components/christmas-header', '@/components/feedback/banners/christmas-header'],

  // Feedback - overlays
  ['@/components/feature-locked-overlay', '@/components/feedback/overlays/feature-locked-overlay'],
  ['@/components/coming-soon-overlay', '@/components/feedback/overlays/coming-soon-overlay'],

  // Feedback - modals
  ['@/components/hot-products-modal', '@/components/feedback/modals/hot-products-modal'],
  ['@/components/onboarding-modal', '@/components/feedback/modals/onboarding-modal'],

  // Shared components
  ['@/components/lottie-icon', '@/components/shared/lottie-icon'],
  ['@/components/prompt-analyzer', '@/components/shared/prompt-analyzer'],
  ['@/components/section-error-boundary', '@/components/shared/section-error-boundary'],
  ['@/components/whatsapp-contact-button', '@/components/shared/whatsapp-contact-button'],
  ['@/components/calendar-19', '@/components/shared/calendar-19'],

  // Marketing components
  ['@/components/academy-marketing-dropdown', '@/components/marketing/academy-marketing-dropdown'],
  ['@/components/platform-marketing-dropdown', '@/components/marketing/platform-marketing-dropdown'],
];

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== '_archive') {
        walkDir(filepath, callback);
      }
    } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      callback(filepath);
    }
  });
}

let filesUpdated = 0;
let totalReplacements = 0;

walkDir('./src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  let fileReplacements = 0;

  replacements.forEach(([oldPath, newPath]) => {
    // Match import statements with quotes
    const regex = new RegExp(`(['"])${oldPath.replace(/\//g, '\\/')}(['"])`, 'g');
    const matches = content.match(regex);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(regex, `$1${newPath}$2`);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated: ${filepath} (${fileReplacements} replacements)`);
    filesUpdated++;
    totalReplacements += fileReplacements;
  }
});

console.log(`\nDone! Updated ${filesUpdated} files with ${totalReplacements} total replacements.`);
