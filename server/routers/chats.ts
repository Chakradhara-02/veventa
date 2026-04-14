import { z } from 'zod';
import { publicProcedure, router, protectedProcedure } from '../utils/trpc';
import { Chat } from '../models/Chat';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export const chatsRouter = router({
  getMessages: publicProcedure
    .input(
      z.object({
        eventId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(50),
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

        const messages = await Chat.find({
          eventId: new mongoose.Types.ObjectId(input.eventId),
        })
          .skip(skip)
          .limit(input.limit)
          .sort({ timestamp: 1 });

        const total = await Chat.countDocuments({
          eventId: new mongoose.Types.ObjectId(input.eventId),
        });

        return {
          messages: messages.map(m => ({
            id: m._id.toString(),
            senderId: m.senderId.toString(),
            senderName: m.senderName,
            senderAvatar: m.senderAvatar,
            text: m.text,
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
          message: 'Failed to fetch messages',
        });
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        text: z.string().min(1),
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

        const chat = new Chat({
          eventId: new mongoose.Types.ObjectId(input.eventId),
          senderId: new mongoose.Types.ObjectId(ctx.user!.userId),
          senderName: ctx.user!.name,
          text: input.text,
        });

        await chat.save();

        return {
          success: true,
          message: {
            id: chat._id.toString(),
            text: chat.text,
            timestamp: chat.timestamp,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send message',
        });
      }
    }),
});
