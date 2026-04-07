import { z } from 'zod';
import { publicProcedure, router, protectedProcedure, organizerProcedure } from '../utils/trpc';
import { Event } from '../models/Event';
import { Registration } from '../models/Registration';
import { TRPCError } from '@trpc/server';
import mongoose from 'mongoose';

export const eventsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const skip = (input.page - 1) * input.limit;
        let query: any = {};

        if (input.category) {
          query.category = input.category;
        }

        if (input.search) {
          query.$or = [
            { title: { $regex: input.search, $options: 'i' } },
            { description: { $regex: input.search, $options: 'i' } },
          ];
        }

        const events = await Event.find(query)
          .skip(skip)
          .limit(input.limit)
          .sort({ date: 1 });

        const total = await Event.countDocuments(query);

        return {
          events: events.map(e => ({
            id: e._id.toString(),
            title: e.title,
            category: e.category,
            date: e.date,
            time: e.time,
            endTime: e.endTime,
            venue: e.venue,
            image: e.image,
            organizer: {
              id: e.organizer.id.toString(),
              name: e.organizer.name,
              avatar: e.organizer.avatar,
            },
            price: e.price,
            ticketsLeft: e.ticketsLeft,
            totalTickets: e.totalTickets,
            registered: e.registered,
            tags: e.tags,
            isTeamEvent: e.isTeamEvent,
            teamSize: e.teamSize,
            featured: e.featured,
          })),
          total,
          page: input.page,
          pages: Math.ceil(total / input.limit),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch events',
        });
      }
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const event = await Event.findById(input);

        if (!event) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Event not found',
          });
        }

        return {
          id: event._id.toString(),
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date,
          time: event.time,
          endTime: event.endTime,
          venue: event.venue,
          image: event.image,
          organizer: {
            id: event.organizer.id.toString(),
            name: event.organizer.name,
            avatar: event.organizer.avatar,
          },
          price: event.price,
          ticketsLeft: event.ticketsLeft,
          totalTickets: event.totalTickets,
          registered: event.registered,
          tags: event.tags,
          isTeamEvent: event.isTeamEvent,
          teamSize: event.teamSize,
          featured: event.featured,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch event',
        });
      }
    }),

  create: organizerProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        category: z.string(),
        date: z.date(),
        time: z.string(),
        endTime: z.string(),
        venue: z.string(),
        image: z.string().optional(),
        price: z.object({
          type: z.enum(['paid', 'free']),
          amount: z.number().optional(),
        }),
        totalTickets: z.number().min(1),
        tags: z.array(z.string()).optional(),
        isTeamEvent: z.boolean().default(false),
        teamSize: z.object({
          min: z.number(),
          max: z.number(),
        }).optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const event = new Event({
          ...input,
          organizer: {
            id: new mongoose.Types.ObjectId(ctx.user!.userId),
            name: ctx.user!.email,
          },
          ticketsLeft: input.totalTickets,
          registered: 0,
        });

        await event.save();

        return {
          success: true,
          event: {
            id: event._id.toString(),
            title: event.title,
            category: event.category,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create event',
        });
      }
    }),

  update: organizerProcedure
    .input(
      z.object({
        eventId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        date: z.date().optional(),
        time: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().optional(),
        image: z.string().optional(),
        featured: z.boolean().optional(),
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

        const event = await Event.findById(input.eventId);

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
            message: 'Not authorized to update this event',
          });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          input.eventId,
          {
            title: input.title || event.title,
            description: input.description || event.description,
            category: input.category || event.category,
            date: input.date || event.date,
            time: input.time || event.time,
            endTime: input.endTime || event.endTime,
            venue: input.venue || event.venue,
            image: input.image || event.image,
            featured: input.featured !== undefined ? input.featured : event.featured,
          },
          { new: true }
        );

        return {
          success: true,
          event: {
            id: updatedEvent!._id.toString(),
            title: updatedEvent!.title,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event',
        });
      }
    }),

  delete: organizerProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(input)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid event ID',
          });
        }

        const event = await Event.findById(input);

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
            message: 'Not authorized to delete this event',
          });
        }

        await Event.findByIdAndDelete(input);

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete event',
        });
      }
    }),

  getCategories: publicProcedure.query(async () => {
    return [
      'Technology',
      'Music',
      'Sports',
      'Art',
      'Business',
      'Gaming',
      'Health',
      'Education',
    ];
  }),
});
