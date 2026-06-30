import twilio from 'twilio';

/** Env-var mode (Vercel / non-Replit). Supports the auth-token shorthand
    (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN) or the API-key triplet. Returns null
    if no env creds are present so we fall back to the Replit connector. */
function envCredentials(): { accountSid: string; authToken?: string; apiKey?: string; apiKeySecret?: string; phoneNumber?: string } | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  if (!accountSid) return null;
  return {
    accountSid,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    apiKey: process.env.TWILIO_API_KEY,
    apiKeySecret: process.env.TWILIO_API_SECRET,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  };
}

async function getCredentials() {
  const env = envCredentials();
  if (env) return env;

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    },
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (
    !connectionSettings ||
    !connectionSettings.settings.account_sid ||
    !connectionSettings.settings.api_key ||
    !connectionSettings.settings.api_key_secret
  ) {
    throw new Error('Twilio not connected');
  }

  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number,
  };
}

export async function getTwilioClient() {
  const creds = await getCredentials() as any;
  // API-key triplet if present, else account-sid + auth-token shorthand.
  if (creds.apiKey && creds.apiKeySecret) {
    return twilio(creds.apiKey, creds.apiKeySecret, { accountSid: creds.accountSid });
  }
  return twilio(creds.accountSid, creds.authToken);
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export async function sendSms(to: string, body: string) {
  const client = await getTwilioClient();
  const from = await getTwilioFromPhoneNumber();

  const message = await client.messages.create({
    body,
    from,
    to,
  });

  return message;
}

export async function sendWhatsApp(to: string, body: string) {
  const client = await getTwilioClient();
  const from = await getTwilioFromPhoneNumber();

  const message = await client.messages.create({
    body,
    from: `whatsapp:${from}`,
    to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
  });

  return message;
}
