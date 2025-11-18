import { db } from '../../../db';
import { quotes } from '../../../db/schema';
import { sql } from 'drizzle-orm';
import RandomClient from './RandomClient';
import { RandomServerProps, Quote } from '../../../lib/definitions';

export default async function RandomServer({ limit }: RandomServerProps) {
    // Fetch random quotes directly using Drizzle on the server
    const randomQuotes = await db
        .select()
        .from(quotes)
        .orderBy(sql`RANDOM()`)
        .limit(limit);

    return (
        <RandomClient randomQuotes={randomQuotes as Quote[]} />
    );
}