import { NextRequest, NextResponse } from 'next/server';
import { toggleVoteOnQuote, getUserVotes } from './votes';
import { getUserFromRequest } from '../../lib/auth';

export async function POST(request: NextRequest) {
    try {
        const userId = await getUserFromRequest();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { quote_id, vote_type } = await request.json();

        const result = await toggleVoteOnQuote(userId, quote_id, vote_type);

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const userId = await getUserFromRequest();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's votes from the database
        const votes = await getUserVotes(userId);

        return NextResponse.json({ votes });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}