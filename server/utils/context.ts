import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { extractTokenFromHeader, verifyToken } from "./auth";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export type VeventaContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthUser | null;
};

export async function createVeventaContext(
  opts: CreateExpressContextOptions
): Promise<VeventaContext> {
  let user: AuthUser | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
