import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

type ContextType = {
  db: typeof db;
  user: User | null;
};

export const createTRPCContext = cache(async (): Promise<ContextType> => {
  return { db: db, user: null };
});

const t = initTRPC.context<ContextType>().create({
  transformer: superjson,
});

const withUser = t.middleware(async ({ ctx, next }) => {
  const { userId } = await auth();
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Credentials is needed to access this resources",
    });
  }

  const user = await ctx.db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Clerk user id is provided but no match on database",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: user,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(withUser);
