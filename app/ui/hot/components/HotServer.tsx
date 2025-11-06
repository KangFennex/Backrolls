import HotClient from './HotClient';
import { getTopRatedQuotes } from '../../../api/data/data';

export default async function HotServer() {
    const hotBackrolls = await getTopRatedQuotes(10);

    return (
        <HotClient hotBackrolls={hotBackrolls} />
    )
}
