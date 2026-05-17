import { z } from 'zod';
import dotenv from 'dotenv';

import path from 'path';
import fs from 'fs';

// Look for .env in CWD first (server/), then in parent (project root)
const envPath = fs.existsSync(path.resolve(process.cwd(), '.env'))
  ? path.resolve(process.cwd(), '.env')
  : path.resolve(process.cwd(), '../.env');

dotenv.config({ path: envPath, override: true });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
