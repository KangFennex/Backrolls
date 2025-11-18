import { router } from './trpc';
import { quotesRouter } from './routers/quotes';
import { favoritesRouter } from './routers/favorites';
import { votesRouter } from './routers/votes';
import { submittedRouter } from './routers/submitted';

export const appRouter = router({
    quotes: quotesRouter,
    favorites: favoritesRouter,
    votes: votesRouter,
    submitted: submittedRouter,
});

export type AppRouter = typeof appRouter;
