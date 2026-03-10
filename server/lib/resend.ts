import { Resend } from 'resend';
import { supabaseRemote } from './supabase-remote';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email,
  };
}

export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail,
  };
}

interface SendEmailOptions {
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  tags?: { name: string; value: string }[];
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: SendEmailOptions,
) {
  const { client, fromEmail } = await getUncachableResendClient();

  const result = await client.emails.send({
    from: fromEmail || 'USDrop AI <noreply@usdrop.ai>',
    to,
    subject,
    html,
    ...(options?.replyTo && { replyTo: options.replyTo }),
    ...(options?.cc && { cc: options.cc }),
    ...(options?.bcc && { bcc: options.bcc }),
    ...(options?.tags && { tags: options.tags }),
  });

  const status = result.error ? 'failed' : 'sent';
  const errorMessage = result.error
    ? JSON.stringify(result.error)
    : undefined;

  try {
    await supabaseRemote.from('email_logs').insert({
      recipient_email: to,
      recipient_type: 'external_user',
      subject,
      status,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
      error_message: errorMessage,
      metadata: {
        resend_id: result.data?.id,
        ...options?.tags?.reduce(
          (acc, t) => ({ ...acc, [t.name]: t.value }),
          {},
        ),
      },
    });
  } catch (logError) {
    console.error('Failed to log email to Supabase:', logError);
  }

  if (result.error) {
    throw new Error(`Failed to send email: ${errorMessage}`);
  }

  return result.data;
}
