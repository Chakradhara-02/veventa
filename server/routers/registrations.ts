import { z } from 'zod';
import { publicProcedure, router, protectedProcedure, organizerProcedure } from '../utils/trpc';
import { Registration } from '../models/Registration';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export const registrationsRouter = router({
  register: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: eventId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const event = await Event.findById(eventId);

        if (!event) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Event not found',
          });
        }

        if (event.ticketsLeft <= 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'No tickets available',
          });
        }

        // Check if already registered (active)
        const existing = await Registration.findOne({
          userId: new mongoose.Types.ObjectId(ctx.user!.userId),
          eventId: new mongoose.Types.ObjectId(eventId),
          status: 'registered',
        });

        if (existing) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Already registered for this event',
          });
        }

        // Upsert: re-activate a cancelled registration or create a new one
        await Registration.findOneAndUpdate(
          {
            userId: new mongoose.Types.ObjectId(ctx.user!.userId),
            eventId: new mongoose.Types.ObjectId(eventId),
          },
          {
            $set: {
              status: 'registered',
              registeredAt: new Date(),
            },
          },
          { upsert: true }
        );

        // Update event counts
        event.ticketsLeft -= 1;
        event.registered += 1;
        await event.save();

        // Update user events attended
        const user = await User.findById(ctx.user!.userId);
        if (user) {
          user.eventsAttended += 1;
          await user.save();
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register for event',
        });
      }
    }),

  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: eventId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const registration = await Registration.findOne({
          userId: new mongoose.Types.ObjectId(ctx.user!.userId),
          eventId: new mongoose.Types.ObjectId(eventId),
          status: 'registered',
        });

        if (!registration) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Registration not found',
          });
        }

        // Update registration status
        registration.status = 'cancelled';
        await registration.save();

        // Update event counts
        const event = await Event.findById(eventId);
        if (event) {
          event.ticketsLeft += 1;
          event.registered = Math.max(0, event.registered - 1);
          await event.save();
        }

        // Decrement user eventsAttended
        const user = await User.findById(ctx.user!.userId);
        if (user) {
          user.eventsAttended = Math.max(0, user.eventsAttended - 1);
          await user.save();
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to cancel registration',
        });
      }
    }),

  isRegistered: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: eventId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
          return false;
        }

        const registration = await Registration.findOne({
          userId: new mongoose.Types.ObjectId(ctx.user!.userId),
          eventId: new mongoose.Types.ObjectId(eventId),
          status: 'registered',
        });

        return !!registration;
      } catch (error) {
        return false;
      }
    }),

  getUserEvents: protectedProcedure.query(async ({ ctx }) => {
    try {
      const registrations = await Registration.find({
        userId: new mongoose.Types.ObjectId(ctx.user!.userId),
        status: 'registered',
      }).populate('eventId');

      const events = registrations.map((reg: any) => ({
        id: reg.eventId._id.toString(),
        title: reg.eventId.title,
        category: reg.eventId.category,
        date: reg.eventId.date,
        time: reg.eventId.time,
        venue: reg.eventId.venue,
        image: reg.eventId.image,
      }));

      return events;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user events',
      });
    }
  }),

  getParticipants: organizerProcedure
    .input(z.string())
    .query(async ({ ctx, input: eventId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const event = await Event.findById(eventId);

        if (!event) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Event not found',
          });
        }

        // Check authorization
        if (event.organizer.id.toString() !== ctx.user!.userId && ctx.user!.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not authorized to view participants',
          });
        }

        const registrations = await Registration.find({
          eventId: new mongoose.Types.ObjectId(eventId),
          status: 'registered',
        }).populate('userId', 'name email avatar');

        return registrations.map((reg: any) => ({
          id: reg.userId._id.toString(),
          name: reg.userId.name,
          email: reg.userId.email,
          avatar: reg.userId.avatar,
          registeredAt: reg.registeredAt,
        }));
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch participants',
        });
      }
    }),
});
