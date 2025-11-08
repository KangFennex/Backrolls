import { RandomPageServerProps } from '../../lib/definitions';
import RandomServer from './components/RandomServer';

export default async function RandomPageServer({ searchParams }: RandomPageServerProps) {
    const params = await searchParams;
    const limit = params.limit ? parseInt(params.limit, 10) : 3; // Default to 3 quotes

    return (
        <div key={limit}>
            <RandomServer limit={limit} />
        </div>
    )
}