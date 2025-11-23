import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../server';
import { createContext } from '../../../server/context';

const handler = async (req: Request) => {
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createContext(),
        onError: ({ error, path }) => {
            console.error(`❌ tRPC Error on ${path}:`, error.message);
        },
    });
};

export { handler as GET, handler as POST };