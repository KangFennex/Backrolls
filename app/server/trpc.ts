import { initTRPC } from '@trpc/server';
import { Context } from './context'; // Add this import

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

// Protected procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session?.user) {
        throw new Error('Not authenticated');
    }
    return next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});