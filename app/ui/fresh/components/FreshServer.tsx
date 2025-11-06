import FreshClient from './FreshClient';
import { getRecentQuotes } from '../../../api/data/data';

export default async function FreshServer() {
    const freshBackrolls = await getRecentQuotes(10)

    return (
        <FreshClient freshBackrolls={freshBackrolls} />
    )
}
