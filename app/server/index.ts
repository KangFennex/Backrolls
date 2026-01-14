import { router } from './trpc';
import { quotesRouter } from './routers/quotes';
import { favoritesRouter } from './routers/favorites';
import { votesRouter } from './routers/votes';
import { submittedRouter } from './routers/submitted';
import { commentsRouter } from './routers/comments';
import { userRouter } from './routers/user';
import { communityRouter } from './routers/community';
import { postRouter } from './routers/post';
import { feedRouter } from './routers/feed';
import { postCommentRouter } from './routers/postComment';

export const appRouter = router({
    quotes: quotesRouter,
    favorites: favoritesRouter,
    votes: votesRouter,
    submitted: submittedRouter,
    comments: commentsRouter,
    user: userRouter,
    community: communityRouter,
    post: postRouter,
    feed: feedRouter,
    postComment: postCommentRouter,
});

export type AppRouter = typeof appRouter;

// Create a caller for server-side usage
export const createCaller = appRouter.createCaller;
