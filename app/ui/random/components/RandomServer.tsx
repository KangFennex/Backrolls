import { getRandomQuote } from '../../../api/data/data';
import RandomClient from './RandomClient';
import { RandomServerProps } from '../../../lib/definitions';

export default async function RandomServer({ limit }: RandomServerProps) {
    const randomQuotes = await getRandomQuote(limit);

    return (
        <RandomClient randomQuotes={randomQuotes} />
    );
}
