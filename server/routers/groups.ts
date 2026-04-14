import { z } from 'zod';
import { publicProcedure, router, protectedProcedure } from '../utils/trpc';
import { Group } from '../models/Group';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export const groupsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        name: z.string().min(2),
        interests: z.array(z.string()).optional(),
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

        const creatorName = (ctx.user as { name?: string }).name?.trim() || ctx.user!.email;

        const userId = new mongoose.Types.ObjectId(ctx.user!.userId);

        const group = new Group({
          eventId: new mongoose.Types.ObjectId(input.eventId),
          name: input.name,
          interests: input.interests || [],
          members: [
            {
              id: userId,
              name: creatorName,
              role: 'leader',
            },
          ],
        });

        await group.save();

        return {
          success: true,
          group: {
            id: group._id.toString(),
            name: group.name,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create group',
        });
      }
    }),

  getByEvent: publicProcedure
    .input(z.string())
    .query(async ({ input: eventId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const groups = await Group.find({
          eventId: new mongoose.Types.ObjectId(eventId),
          status: 'active',
        });

        return groups.map(g => ({
          id: g._id.toString(),
          eventId: g.eventId.toString(),
          name: g.name,
          members: g.members.map(m => ({
            id: m.id.toString(),
            name: m.name,
            avatar: m.avatar,
            role: m.role,
          })),
          interests: g.interests,
        }));
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch groups',
        });
      }
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input.groupId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid group ID',
          });
        }

        const group = await Group.findById(input.groupId);

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          });
        }

        // Check if user is leader
        const isLeader = group.members.some(
          m => m.id.toString() === ctx.user!.userId && m.role === 'leader'
        );

        if (!isLeader && ctx.user!.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only group leader can add members',
          });
        }

        // Check if member already exists
        const alreadyMember = group.members.some(
          m => m.id.toString() === input.userId
        );

        if (alreadyMember) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User is already a member',
          });
        }

        group.members.push({
          id: new mongoose.Types.ObjectId(input.userId),
          name: input.userId,
          role: 'member',
        });

        await group.save();

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add member',
        });
      }
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input.groupId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid group ID',
          });
        }

        const group = await Group.findById(input.groupId);

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          });
        }

        // Check if user is leader
        const isLeader = group.members.some(
          m => m.id.toString() === ctx.user!.userId && m.role === 'leader'
        );

        if (!isLeader && ctx.user!.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only group leader can remove members',
          });
        }

        group.members = group.members.filter(
          m => m.id.toString() !== input.userId
        );

        await group.save();

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove member',
        });
      }
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: groupId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid group ID',
          });
        }

        const group = await Group.findById(groupId);

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          });
        }

        // Check if user is leader
        const isLeader = group.members.some(
          m => m.id.toString() === ctx.user!.userId && m.role === 'leader'
        );

        if (!isLeader && ctx.user!.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Only group leader can delete group',
          });
        }

        await Group.findByIdAndDelete(groupId);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group',
        });
      }
    }),
});
