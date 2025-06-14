import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from './environment';

// Create postgres client
const client = postgres(config.database.url);

// Create drizzle instance
export const db = drizzle(client);

export type Database = typeof db;