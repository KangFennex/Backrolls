import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set');
}

// Create postgres connection with connection pooling settings
const connectionString = process.env.POSTGRES_URL;
const client = postgres(connectionString, {
    max: 10, // Maximum pool size
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
});

// Create drizzle instance
export const db = drizzle(client, { schema });
