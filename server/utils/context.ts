import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { extractTokenFromHeader, verifyToken } from "./auth";
import { User } from "../models/User";

export interface AuthUser {
  userId: string;
  name?: string;
  email: string;
  role: string;
  avatar?: string;
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
        const profile = await User.findById(decoded.userId)
          .select("name email role avatar")
          .lean();

        user = {
          userId: decoded.userId,
          name: profile?.name || decoded.name,
          email: profile?.email || decoded.email,
          role: profile?.role || decoded.role,
          avatar: profile?.avatar || decoded.avatar,
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
