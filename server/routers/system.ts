import { z } from "zod";
import { publicProcedure, router } from "../utils/trpc";

export const customSystemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),
});
