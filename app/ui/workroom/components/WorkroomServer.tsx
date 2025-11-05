import { WorkroomClient } from './WorkroomClient';
import { getRandomQuote } from '../../../api/data/data';

export default async function WorkroomServer() {

    const randomQuotes = await getRandomQuote(30);

    const quotesArray = Array.isArray(randomQuotes) ? randomQuotes :
        randomQuotes ? [randomQuotes] : [];


    return (
        <WorkroomClient
            initialQuotes={quotesArray}
        />
    );
}