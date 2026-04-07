import { z } from 'zod';
import { publicProcedure, router, organizerProcedure } from '../utils/trpc';
import { Event } from '../models/Event';
import { Registration } from '../models/Registration';
import { User } from '../models/User';
import { TRPCError } from '@trpc/server';

export const analyticsRouter = router({
  getDashboard: organizerProcedure.query(async ({ ctx }) => {
    try {
      // Get total registrations
      const totalRegistrations = await Registration.countDocuments({
        status: 'registered',
      });

      // Get active events
      const now = new Date();
      const activeEvents = await Event.countDocuments({
        date: { $gte: now },
      });

      // Get total revenue
      const paidEvents = await Event.find({
        'price.type': 'paid',
      });

      let totalRevenue = 0;
      for (const event of paidEvents) {
        if (event.price.amount) {
          totalRevenue += event.price.amount * event.registered;
        }
      }

      // Get new users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const newUsersThisMonth = await User.countDocuments({
        joinDate: { $gte: firstDayOfMonth },
      });

      return {
        totalRegistrations,
        activeEvents,
        totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        newUsersThisMonth,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard analytics',
      });
    }
  }),

  getRegistrationTrends: organizerProcedure.query(async () => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trends = [];

      for (let i = 0; i < 6; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const count = await Registration.countDocuments({
          createdAt: { $gte: date, $lt: nextMonth },
          status: 'registered',
        });

        trends.push({
          month: months[date.getMonth()],
          count,
        });
      }

      return trends;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch registration trends',
      });
    }
  }),

  getCategoryBreakdown: publicProcedure.query(async () => {
    try {
      const categories = [
        'Technology',
        'Music',
        'Business',
        'Art',
        'Other',
      ];

      const breakdown = [];
      const totalEvents = await Event.countDocuments();

      for (const category of categories) {
        const count = await Event.countDocuments({ category });
        const pct = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;

        breakdown.push({
          category,
          pct,
        });
      }

      return breakdown;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch category breakdown',
      });
    }
  }),

  getOrganizerStats: organizerProcedure.query(async ({ ctx }) => {
    try {
      // Get organizer's events
      const organizerEvents = await Event.find({
        'organizer.id': ctx.user!.userId,
      });

      const totalEventsCreated = organizerEvents.length;
      const totalRegistrations = organizerEvents.reduce((sum, e) => sum + e.registered, 0);

      // Calculate revenue
      let totalRevenue = 0;
      for (const event of organizerEvents) {
        if (event.price.type === 'paid' && event.price.amount) {
          totalRevenue += event.price.amount * event.registered;
        }
      }

      return {
        totalEventsCreated,
        totalRegistrations,
        totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
        upcomingEvents: organizerEvents.filter(e => e.date > new Date()).length,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch organizer stats',
      });
    }
  }),
});
