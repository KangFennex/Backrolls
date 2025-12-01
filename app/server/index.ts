import { router } from './trpc';
import { quotesRouter } from './routers/quotes';
import { favoritesRouter } from './routers/favorites';
import { votesRouter } from './routers/votes';
import { submittedRouter } from './routers/submitted';
import { commentsRouter } from './routers/comments';

export const appRouter = router({
    quotes: quotesRouter,
    favorites: favoritesRouter,
    votes: votesRouter,
    submitted: submittedRouter,
    comments: commentsRouter,
});

export type AppRouter = typeof appRouter;

// Create a caller for server-side usage
export const createCaller = appRouter.createCaller;
