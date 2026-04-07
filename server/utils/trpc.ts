import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { VeventaContext } from "./context";

const t = initTRPC.context<VeventaContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

const requireAdmin = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(requireAdmin);

const requireOrganizerOrAdmin = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user || (ctx.user.role !== 'organizer' && ctx.user.role !== 'admin')) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Organizer access required" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const organizerProcedure = t.procedure.use(requireOrganizerOrAdmin);
