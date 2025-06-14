import type { Config } from 'drizzle-kit';
import { config } from './src/config/environment';

export default {
  schema: './src/models/*.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: config.database.url,
  },
} satisfies Config;