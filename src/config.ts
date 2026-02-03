import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnvVar = (name: string, required = true): string => {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`CRITICAL ERROR: Env variable ${name} is missing.`);
  }
  return value || '';
};

export const config = {
  port: process.env.PORT || 3000,

  db: {
    host: getEnvVar('DB_HOST'),
  },

  externalApi: {
    url: getEnvVar('EXTERNAL_FOOTBALL_API_URL'),
    secondaryUrl: getEnvVar('EXTERNAL_BASKETBALL_API_URL'),
    nhlApiUrl: getEnvVar('EXTERNAL_HOCKEY_API_URL'),
    key: getEnvVar('EXTERNAL_API_KEY'),
  },
};
