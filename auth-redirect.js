const LOCAL_APP_URL = 'http://localhost:3000';

const APP_URL_KEYS = ['PUBLIC_APP_URL', 'APP_URL', 'SITE_URL', 'SUPABASE_SITE_URL'];
const VERCEL_URL_KEYS = ['VERCEL_URL', 'VERCEL_BRANCH_URL', 'VERCEL_PROJECT_PRODUCTION_URL'];

function parseAppOrigin(value, name) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid absolute URL`);
  }

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error(`${name} must be an HTTP(S) URL without credentials`);
  }
  return url.origin;
}

function parseVercelOrigin(value, name) {
  const url = value.includes('://') ? value : `https://${value}`;
  return parseAppOrigin(url, name);
}

function isLocalOrigin(origin) {
  const hostname = new URL(origin).hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function getAuthRedirectUrl(req, path = '/', env = process.env) {
  const isProduction = env.NODE_ENV === 'production' || env.VERCEL === '1';
  const configuredOrigins = [];
  const appOrigins = [];
  const vercelOrigins = [];

  for (const key of APP_URL_KEYS) {
    if (!env[key]) continue;
    const origin = parseAppOrigin(env[key], key);
    if (isProduction && isLocalOrigin(origin)) continue;
    configuredOrigins.push(origin);
    appOrigins.push(origin);
  }

  for (const key of VERCEL_URL_KEYS) {
    if (!env[key]) continue;
    const origin = parseVercelOrigin(env[key], key);
    configuredOrigins.push(origin);
    vercelOrigins.push(origin);
  }

  if (!isProduction) configuredOrigins.push(LOCAL_APP_URL);

  const requestOrigin = req?.get?.('origin') || req?.headers?.origin;
  if (requestOrigin) {
    try {
      const origin = parseAppOrigin(requestOrigin, 'Request Origin');
      if (configuredOrigins.includes(origin)) return new URL(path, origin).toString();
    } catch {
      // An invalid request origin is ignored; configured origins remain authoritative.
    }
  }

  const requestHost = req?.get?.('host') || req?.headers?.host;
  if (requestHost) {
    try {
      const requestHostUrl = new URL(`https://${requestHost}`);
      if (!requestHostUrl.username && !requestHostUrl.password) {
        const matchingOrigin = configuredOrigins.find(origin => new URL(origin).host === requestHostUrl.host);
        if (matchingOrigin) return new URL(path, matchingOrigin).toString();
      }
    } catch {
      // An invalid or untrusted request host is ignored.
    }
  }

  const fallbackVercelOrigin = env.VERCEL_PROJECT_PRODUCTION_URL
    ? parseVercelOrigin(env.VERCEL_PROJECT_PRODUCTION_URL, 'VERCEL_PROJECT_PRODUCTION_URL')
    : env.VERCEL_BRANCH_URL
      ? parseVercelOrigin(env.VERCEL_BRANCH_URL, 'VERCEL_BRANCH_URL')
      : vercelOrigins[0];
  const fallbackOrigin = appOrigins[0] || fallbackVercelOrigin;
  if (fallbackOrigin) return new URL(path, fallbackOrigin).toString();
  if (!isProduction) return new URL(path, LOCAL_APP_URL).toString();

  throw new Error('Set PUBLIC_APP_URL or APP_URL to the deployed Klasora origin before generating auth links');
}

module.exports = { getAuthRedirectUrl };
