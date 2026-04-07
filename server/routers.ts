import { router } from "./utils/trpc";
import { authRouter } from "./routers/auth";
import { eventsRouter } from "./routers/events";
import { registrationsRouter } from "./routers/registrations";
import { memoriesRouter } from "./routers/memories";
import { chatsRouter } from "./routers/chats";
import { groupsRouter } from "./routers/groups";
import { analyticsRouter } from "./routers/analytics";
import { customSystemRouter } from "./routers/system";

export const appRouter = router({
  system: customSystemRouter,
  auth: authRouter,
  events: eventsRouter,
  registrations: registrationsRouter,
  memories: memoriesRouter,
  chats: chatsRouter,
  groups: groupsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;

