import { EmailTemplate } from "@/types/admin/email-automation"

export const sampleTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to USDrop!',
    type: 'utility',
    category: 'welcome',
    description: 'Welcome email for new users',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to USDrop</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F6F7F7;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F7F7; padding: 0;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 624px; margin: 0 auto;">
                
                <!-- Header with Dark Blue/Black Gradient -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #000000 0%, #1e3a8a 50%, #1e40af 100%); background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 400 400\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'saturate\\' values=\\'0\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\' opacity=\\'0.3\\'/%3E%3C/svg%3E'), linear-gradient(135deg, #000000 0%, #1e3a8a 50%, #1e40af 100%);">
                      <tr>
                        <td style="padding: 40px 32px 48px 32px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td align="center" style="padding-bottom: 32px;">
                                <div style="display: inline-block; padding: 16px 24px; background-color: rgba(255, 255, 255, 0.1); border-radius: 12px; border: 2px solid rgba(255, 255, 255, 0.2);">
                                  <span style="font-family: 'DM Sans', sans-serif; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: 1px;">USDrop</span>
                                  <span style="font-family: 'DM Sans', sans-serif; font-size: 28px; font-weight: 700; color: #60a5fa; letter-spacing: 1px;">AI</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align="center">
                                <h1 style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 32px; font-weight: 700; line-height: 40px; color: #FFFFFF; letter-spacing: -0.5px;">Welcome, {{user.name}}</h1>
                                <p style="margin: 16px auto 0 auto; font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 400; line-height: 28px; color: rgba(255, 255, 255, 0.95); max-width: 480px;">We're thrilled to have you join the USDrop community</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Hero Image Section -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; padding: 0;">
                      <tr>
                        <td style="padding: 0;">
                          <img src="{{company.website}}/images/email/welcome-hero.png" alt="Professional AI-Powered Business Workspace" style="width: 100%; max-width: 624px; height: auto; display: block; margin: 0;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Main Content -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; padding: 48px 32px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 32px 0; font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 400; line-height: 28px; color: #4a5568;">Thanks for joining USDrop! We're excited to have you on board and look forward to helping you grow your business with our AI-powered tools. Your journey to smarter business operations starts now.</p>
                          
                          <!-- Primary CTA -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 48px 0; width: 100%;">
                            <tr>
                              <td align="center">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 10px; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3);">
                                      <a href="{{company.website}}/dashboard" style="display: inline-block; padding: 16px 40px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">Get Started Now</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Account Info Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #F6F7F7 0%, #FFFFFF 100%); border-radius: 16px; padding: 32px; margin-bottom: 48px; border: 2px solid #E5E7E7; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
                            <tr>
                              <td>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="48" style="vertical-align: top; padding-right: 16px;">
                                      <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                                        </svg>
                                      </div>
                                    </td>
                                    <td style="vertical-align: top;">
                                      <p style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; line-height: 20px; letter-spacing: 1px; text-transform: uppercase; color: #6b7280;">Your Account Email</p>
                                      <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 600; line-height: 28px; color: #172327;">{{user.email}}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Features Section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 48px;">
                            <tr>
                              <td>
                                <h2 style="margin: 0 0 32px 0; font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; line-height: 32px; color: #172327; text-align: center;">Powerful Features at Your Fingertips</h2>
                                
                                <!-- Feature Grid -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="50%" style="padding: 0 12px 24px 0; vertical-align: top;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F7F7; border-radius: 12px; padding: 24px; border: 1px solid #E5E7E7;">
                                        <tr>
                                          <td align="center" style="padding-bottom: 16px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                              </svg>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #172327;">AI Studio</h3>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; color: #6b7280; text-align: center;">Create stunning visuals with AI-powered tools</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td width="50%" style="padding: 0 0 24px 12px; vertical-align: top;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F7F7; border-radius: 12px; padding: 24px; border: 1px solid #E5E7E7;">
                                        <tr>
                                          <td align="center" style="padding-bottom: 16px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 22.08V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                              </svg>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #172327;">Product Research</h3>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; color: #6b7280; text-align: center;">Discover winning products with data insights</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="50%" style="padding: 0 12px 0 0; vertical-align: top;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F7F7; border-radius: 12px; padding: 24px; border: 1px solid #E5E7E7;">
                                        <tr>
                                          <td align="center" style="padding-bottom: 16px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21H3.08C2.48 21 2 20.52 2 19.92V16.92C2 16.32 2.48 15.84 3.08 15.84H20.92C21.52 15.84 22 16.32 22 16.92Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                              </svg>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #172327;">Analytics</h3>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; color: #6b7280; text-align: center;">Track performance with real-time insights</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                    <td width="50%" style="padding: 0 0 0 12px; vertical-align: top;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F6F7F7; border-radius: 12px; padding: 24px; border: 1px solid #E5E7E7;">
                                        <tr>
                                          <td align="center" style="padding-bottom: 16px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                              </svg>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td align="center">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #172327;">Automation</h3>
                                            <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; color: #6b7280; text-align: center;">Streamline workflows with smart automation</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Divider -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 48px 0;">
                            <tr>
                              <td style="border-top: 2px solid #E5E7E7;"></td>
                            </tr>
                          </table>

                          <!-- Next Steps Section -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 48px;">
                            <tr>
                              <td>
                                <h2 style="margin: 0 0 32px 0; font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; line-height: 32px; color: #172327;">Your Journey Starts Here</h2>
                                
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td style="padding-bottom: 32px;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td width="64" style="vertical-align: top; padding-right: 20px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);">
                                              <span style="font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; color: #FFFFFF;">1</span>
                                            </div>
                                          </td>
                                          <td style="vertical-align: top;">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 600; line-height: 28px; color: #172327;">Set up your first product</h3>
                                            <p style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; color: #6b7280;">Create and configure your first product to get started. Our intuitive interface makes it easy to add product details, images, and pricing.</p>
                                            <a href="{{company.website}}/products/new" style="font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #1e40af; text-decoration: none;">Learn more →</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding-bottom: 32px;">
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td width="64" style="vertical-align: top; padding-right: 20px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);">
                                              <span style="font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; color: #FFFFFF;">2</span>
                                            </div>
                                          </td>
                                          <td style="vertical-align: top;">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 600; line-height: 28px; color: #172327;">Connect your store</h3>
                                            <p style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; color: #6b7280;">Link your e-commerce platform to sync products and orders automatically. We support all major platforms including Shopify, WooCommerce, and more.</p>
                                            <a href="{{company.website}}/integrations" style="font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #1e40af; text-decoration: none;">View integrations →</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                          <td width="64" style="vertical-align: top; padding-right: 20px;">
                                            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);">
                                              <span style="font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; color: #FFFFFF;">3</span>
                                            </div>
                                          </td>
                                          <td style="vertical-align: top;">
                                            <h3 style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: 600; line-height: 28px; color: #172327;">Launch your first campaign</h3>
                                            <p style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; color: #6b7280;">Start creating and managing your marketing campaigns. Use our AI-powered tools to optimize your ads and maximize ROI.</p>
                                            <a href="{{company.website}}/campaigns/new" style="font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #1e40af; text-decoration: none;">Create campaign →</a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Secondary CTA -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #000000 0%, #1e3a8a 100%); border-radius: 16px; padding: 40px 32px; margin-bottom: 48px;">
                            <tr>
                              <td align="center">
                                <h2 style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 24px; font-weight: 700; line-height: 32px; color: #FFFFFF;">Need Help Getting Started?</h2>
                                <p style="margin: 0 0 24px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; color: rgba(255, 255, 255, 0.9); max-width: 480px;">Our team is here to help you succeed. Schedule a free consultation or explore our resources.</p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="padding: 0 8px;">
                                      <a href="{{company.website}}/support" style="display: inline-block; padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; color: #FFFFFF; text-decoration: none; background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.3);">Contact Support</a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                      <a href="{{company.website}}/resources" style="display: inline-block; padding: 12px 24px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; color: #1e3a8a; text-decoration: none; background-color: #FFFFFF; border-radius: 8px;">View Resources</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; padding: 0;">
                      <tr>
                        <td style="padding: 48px 32px; background-color: #F6F7F7;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <!-- Social Links -->
                            <tr>
                              <td align="center" style="padding-bottom: 32px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="padding: 0 12px;">
                                      <a href="{{company.website}}/twitter" style="display: inline-block; width: 40px; height: 40px; background-color: #1e3a8a; border-radius: 50%; text-align: center; line-height: 40px;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                                          <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95791 14.8821 3.28751C14.0247 3.6171 13.2884 4.20566 12.773 4.97672C12.2575 5.74778 11.9877 6.66336 12 7.6V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </a>
                                    </td>
                                    <td style="padding: 0 12px;">
                                      <a href="{{company.website}}/linkedin" style="display: inline-block; width: 40px; height: 40px; background-color: #1e3a8a; border-radius: 50%; text-align: center; line-height: 40px;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                                          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M6 9H2V21H6V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </a>
                                    </td>
                                    <td style="padding: 0 12px;">
                                      <a href="{{company.website}}/facebook" style="display: inline-block; width: 40px; height: 40px; background-color: #1e3a8a; border-radius: 50%; text-align: center; line-height: 40px;">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                                          <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            
                            <!-- Help Section -->
                            <tr>
                              <td align="center" style="padding-bottom: 32px;">
                                <p style="margin: 0 0 16px 0; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600; line-height: 24px; color: #172327;">Need help? We're here for you.</p>
                                <p style="margin: 0 0 24px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400; line-height: 20px; color: #6b7280;">
                                  <a href="{{company.website}}" style="color: #1e40af; text-decoration: none; font-weight: 500; margin: 0 12px;">Visit our website</a>
                                  <span style="color: #d1d5db; margin: 0 8px;">•</span>
                                  <a href="mailto:{{company.email}}" style="color: #1e40af; text-decoration: none; font-weight: 500; margin: 0 12px;">Contact Support</a>
                                  <span style="color: #d1d5db; margin: 0 8px;">•</span>
                                  <a href="{{company.website}}/docs" style="color: #1e40af; text-decoration: none; font-weight: 500; margin: 0 12px;">Documentation</a>
                                </p>
                              </td>
                            </tr>
                            
                            <!-- Company Info -->
                            <tr>
                              <td align="center" style="padding-bottom: 32px; border-top: 1px solid #E5E7E7; padding-top: 32px;">
                                <p style="margin: 0 0 8px 0; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; line-height: 20px; color: #172327;">{{company.name}}</p>
                                <p style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; line-height: 18px; color: #9ca3af;">Empowering businesses with AI-powered solutions</p>
                              </td>
                            </tr>
                            
                            <!-- Footer Links -->
                            <tr>
                              <td align="center">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                  <tr>
                                    <td style="padding: 0 8px;">
                                      <a href="{{company.website}}/unsubscribe" style="text-decoration: none; color: #6b7280; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; line-height: 20px; padding: 6px 16px; background-color: #FFFFFF; border-radius: 6px; display: inline-block; border: 1px solid #E5E7E7;">Unsubscribe</a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                      <a href="{{company.website}}" style="text-decoration: none; color: #6b7280; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; line-height: 20px; padding: 6px 16px; background-color: #FFFFFF; border-radius: 6px; display: inline-block; border: 1px solid #E5E7E7;">Web version</a>
                                    </td>
                                    <td style="padding: 0 8px;">
                                      <a href="{{company.website}}/privacy" style="text-decoration: none; color: #6b7280; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400; line-height: 20px; padding: 6px 16px; background-color: #FFFFFF; border-radius: 6px; display: inline-block; border: 1px solid #E5E7E7;">Privacy Policy</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    textContent: 'Welcome {{user.name}}! Thanks for joining USDrop. We\'re excited to have you on board. Your email: {{user.email}}. Get started by exploring our features at {{company.website}}. Best regards, {{company.name}} Team',
    variables: ['{{user.name}}', '{{user.email}}', '{{company.name}}', '{{company.website}}', '{{company.email}}'],
    isActive: true,
    isPublic: true,
    level: 'free',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Password Reset',
    subject: 'Reset Your Password',
    type: 'utility',
    category: 'password-reset',
    description: 'Password reset email with secure link',
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Password Reset Request</h1>
          <p>Hello {{user.name}},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="{{resetLink}}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>{{company.name}} Team</p>
        </body>
      </html>
    `,
    textContent: 'Password reset requested. Click the link to reset your password.',
    variables: ['{{user.name}}', '{{resetLink}}', '{{company.name}}'],
    isActive: true,
    isPublic: true,
    level: 'free',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Order Confirmation',
    subject: 'Order Confirmation - {{order.id}}',
    type: 'transactional',
    category: 'order-confirmation',
    description: 'Order confirmation email with receipt',
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Order Confirmation</h1>
          <p>Hello {{user.name}},</p>
          <p>Thank you for your order!</p>
          <p><strong>Order ID:</strong> {{order.id}}</p>
          <p><strong>Total:</strong> {{order.total}}</p>
          <p><strong>Items:</strong> {{order.items}}</p>
          <p>Best regards,<br>{{company.name}} Team</p>
        </body>
      </html>
    `,
    textContent: 'Order confirmed. Order ID: {{order.id}}, Total: {{order.total}}',
    variables: ['{{user.name}}', '{{order.id}}', '{{order.total}}', '{{order.items}}', '{{company.name}}'],
    isActive: true,
    isPublic: true,
    level: 'free',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    name: 'Shipping Notification',
    subject: 'Your Order Has Shipped - {{order.id}}',
    type: 'transactional',
    category: 'shipping-notification',
    description: 'Shipping notification with tracking information',
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Your Order Has Shipped!</h1>
          <p>Hello {{user.name}},</p>
          <p>Great news! Your order {{order.id}} has been shipped.</p>
          <p><strong>Tracking Number:</strong> {{order.trackingNumber}}</p>
          <p><strong>Shipping Address:</strong> {{order.shippingAddress}}</p>
          <p>Best regards,<br>{{company.name}} Team</p>
        </body>
      </html>
    `,
    textContent: 'Your order {{order.id}} has shipped. Tracking: {{order.trackingNumber}}',
    variables: ['{{user.name}}', '{{order.id}}', '{{order.trackingNumber}}', '{{order.shippingAddress}}', '{{company.name}}'],
    isActive: true,
    isPublic: true,
    level: 'free',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: '5',
    name: 'Abandoned Cart',
    subject: 'You left items in your cart',
    type: 'marketing',
    category: 'abandoned-cart',
    description: 'Abandoned cart recovery email',
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Don't forget your items!</h1>
          <p>Hello {{user.name}},</p>
          <p>You left some items in your cart. Complete your purchase now!</p>
          <a href="{{cartLink}}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Purchase</a>
          <p>Best regards,<br>{{company.name}} Team</p>
        </body>
      </html>
    `,
    textContent: 'You left items in your cart. Complete your purchase at {{cartLink}}',
    variables: ['{{user.name}}', '{{cartLink}}', '{{company.name}}'],
    isActive: true,
    isPublic: true,
    level: 'pro',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
  },
]
