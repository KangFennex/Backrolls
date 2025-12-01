import { db } from '../../../db';
import { quotes } from '../../../db/schema';
import { sql } from 'drizzle-orm';
import RandomClient from './RandomClient';
import { RandomServerProps } from '../../../lib/definitions';

export default async function RandomServer({ limit }: RandomServerProps) {
    // Fetch random quotes directly using Drizzle on the server so the component can fetch new quotes on each request without cache issues
    const randomQuotes = await db
        .select()
        .from(quotes)
        .orderBy(sql`RANDOM()`)
        .limit(limit);

    // Transform Date objects to strings for client component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedQuotes = randomQuotes.map((quote: any) => ({
        ...quote,
        created_at: quote.created_at instanceof Date
            ? quote.created_at.toISOString()
            : quote.created_at,
        air_date: quote.air_date instanceof Date
            ? quote.air_date.toISOString()
            : quote.air_date,
    })); return (
        <RandomClient randomQuotes={transformedQuotes} />
    );
}