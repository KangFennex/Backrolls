import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../lib/auth";
import { submitQuote } from "./submit";

export async function POST(req: NextRequest) {
    const { quote, speaker, series, season, episode, timestamp, context } = await req.json();

    // Validate the incoming data
    if (!quote || !speaker || !series || !season || !episode) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    try {
        const userId = await getUserFromRequest(req);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await submitQuote({
            quote,
            speaker,
            series,
            season,
            episode,
            timestamp,
            context,
            userId
        });

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve user information.' }, { status: 500 });
    }

}