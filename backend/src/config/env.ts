import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string()
    .url('DATABASE_URL must be a valid URL')
    .refine(url => url.includes('postgresql') || url.includes('postgres'), {
      message: 'DATABASE_URL must be a PostgreSQL connection string'
    }),

  // JWT
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters (use: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")')
    .describe('Secret key for JWT signing'),
  
  JWT_EXPIRY: z.string()
    .default('7d')
    .describe('JWT token expiration time'),

  // Server
  PORT: z.string()
    .default('4000')
    .transform(Number)
    .pipe(z.number().int().positive()),

  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),

  // CORS (optional)
  CORS_ORIGIN: z.string()
    .default('http://localhost:5173,http://localhost:3000'),

  // Email (SMTP)
  SMTP_HOST: z.string()
    .default('smtp.gmail.com'),
  
  SMTP_PORT: z.string()
    .default('587')
    .transform(Number)
    .pipe(z.number().int().positive()),
  
  SMTP_USER: z.string()
    .optional(),
  
  SMTP_PASS: z.string()
    .optional(),
  
  SMTP_FROM_NAME: z.string()
    .default('IAPedia'),
  
  SMTP_FROM_EMAIL: z.string()
    .optional(),
  
  FRONTEND_URL: z.string()
    .url('FRONTEND_URL must be a valid URL')
    .default('http://localhost:5173')
});

/**
 * Validated environment variables
 * Throws error if validation fails
 */
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
  console.log('✅ Environment variables validated successfully');
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`  • ${err.path.join('.')}: ${err.message}`);
    });
  }
  process.exit(1);
}

export { env };
export default env;
