import { z } from 'zod';
import { publicProcedure, router, protectedProcedure } from '../utils/trpc';
import { User } from '../models/User';
import { generateToken } from '../utils/auth';
import { TRPCError } from '@trpc/server';
import { COOKIE_NAME } from '../../shared/const';
import { getSessionCookieOptions } from '../_core/cookies';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(['participant', 'organizer', 'admin']).default('participant'),
        interests: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already registered',
          });
        }

        // Create new user
        const user = new User({
          name: input.name,
          email: input.email,
          password: input.password,
          role: input.role,
          interests: input.interests || [],
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 30) + 1}`,
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        return {
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed',
        });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOne({ email: input.email });

        if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        const isPasswordValid = await user.comparePassword(input.password);

        if (!isPasswordValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid email or password',
          });
        }

        // Update last signed in
        user.lastSignedIn = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        return {
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed',
        });
      }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await User.findById(ctx.user?.userId);

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        interests: user.interests,
        joinDate: user.joinDate,
        eventsAttended: user.eventsAttended,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user',
      });
    }
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        bio: z.string().optional(),
        interests: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await User.findByIdAndUpdate(
          ctx.user?.userId,
          {
            name: input.name,
            bio: input.bio,
            interests: input.interests,
          },
          { new: true }
        );

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return {
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
        });
      }
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, {
      ...getSessionCookieOptions(ctx.req as any),
      maxAge: -1,
    });

    return { success: true };
  }),
});
