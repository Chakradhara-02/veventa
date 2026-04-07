import { z } from 'zod';
import { publicProcedure, router, protectedProcedure } from '../utils/trpc';
import { Memory } from '../models/Memory';
import { Event } from '../models/Event';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export const memoriesRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        eventTitle: z.string(),
        type: z.enum(['photo', 'video']),
        url: z.string(),
        caption: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input.eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const memory = new Memory({
          eventId: new mongoose.Types.ObjectId(input.eventId),
          eventTitle: input.eventTitle,
          author: {
            id: new mongoose.Types.ObjectId(ctx.user!.userId),
            name: ctx.user!.email,
          },
          type: input.type,
          url: input.url,
          caption: input.caption,
        });

        await memory.save();

        return {
          success: true,
          memory: {
            id: memory._id.toString(),
            caption: memory.caption,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create memory',
        });
      }
    }),

  getByEvent: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input.eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const skip = (input.page - 1) * input.limit;

        const memories = await Memory.find({
          eventId: new mongoose.Types.ObjectId(input.eventId),
        })
          .skip(skip)
          .limit(input.limit)
          .sort({ timestamp: -1 });

        const total = await Memory.countDocuments({
          eventId: new mongoose.Types.ObjectId(input.eventId),
        });

        return {
          memories: memories.map(m => ({
            id: m._id.toString(),
            eventId: m.eventId.toString(),
            eventTitle: m.eventTitle,
            author: {
              id: m.author.id.toString(),
              name: m.author.name,
              avatar: m.author.avatar,
            },
            type: m.type,
            url: m.url,
            caption: m.caption,
            likes: m.likes,
            comments: m.comments.map(c => ({
              id: c._id?.toString(),
              author: c.author.name,
              text: c.text,
              time: c.createdAt,
            })),
            timestamp: m.timestamp,
          })),
          total,
          page: input.page,
          pages: Math.ceil(total / input.limit),
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch memories',
        });
      }
    }),

  like: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: memoryId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(memoryId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid memory ID',
          });
        }

        const memory = await Memory.findById(memoryId);

        if (!memory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Memory not found',
          });
        }

        const userId = new mongoose.Types.ObjectId(ctx.user!.userId);
        const alreadyLiked = memory.likedBy.some(id => id.equals(userId));

        if (alreadyLiked) {
          // Unlike
          memory.likedBy = memory.likedBy.filter(id => !id.equals(userId));
          memory.likes = Math.max(0, memory.likes - 1);
        } else {
          // Like
          memory.likedBy.push(userId);
          memory.likes += 1;
        }

        await memory.save();

        return { success: true, liked: !alreadyLiked };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to like memory',
        });
      }
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        memoryId: z.string(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input.memoryId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid memory ID',
          });
        }

        const memory = await Memory.findById(input.memoryId);

        if (!memory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Memory not found',
          });
        }

        memory.comments.push({
          _id: new mongoose.Types.ObjectId(),
          author: {
            id: new mongoose.Types.ObjectId(ctx.user!.userId),
            name: ctx.user!.email,
          },
          text: input.text,
          createdAt: new Date(),
        });

        await memory.save();

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add comment',
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: memoryId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(memoryId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid memory ID',
          });
        }

        const memory = await Memory.findById(memoryId);

        if (!memory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Memory not found',
          });
        }

        // Check authorization
        if (memory.author.id.toString() !== ctx.user!.userId && ctx.user!.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to delete this memory',
          });
        }

        await Memory.findByIdAndDelete(memoryId);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete memory',
        });
      }
    }),
});
