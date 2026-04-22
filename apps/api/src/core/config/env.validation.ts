type EnvShape = {
  NODE_ENV: string;
  PORT: string;
  FRONTEND_URL: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TTL: string;
  JWT_REFRESH_TTL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  TURNSTILE_SECRET_KEY: string;
  DEEPSEEK_API_KEY?: string;
};

const REQUIRED_KEYS: Array<keyof EnvShape> = [
  'NODE_ENV',
  'PORT',
  'FRONTEND_URL',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_TTL',
  'JWT_REFRESH_TTL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'TURNSTILE_SECRET_KEY',
];

export function validateEnv(config: Record<string, unknown>): EnvShape {
  const missing = REQUIRED_KEYS.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  return config as EnvShape;
}
