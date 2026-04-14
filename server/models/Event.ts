import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  date: Date;
  time: string;
  endTime: string;
  venue: string;
  image: string;
  organizer: {
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  price: {
    type: 'paid' | 'free';
    amount?: number;
  };
  ticketsLeft: number;
  totalTickets: number;
  registered: number;
  tags: string[];
  isTeamEvent: boolean;
  teamSize?: {
    min: number;
    max: number;
  };
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    image: { type: String },
    organizer: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      avatar: { type: String },
    },
    price: {
      type: {
        type: String,
        enum: ['paid', 'free'],
        default: 'free',
      },
      amount: { type: Number },
    },
    ticketsLeft: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    registered: { type: Number, default: 0 },
    tags: [{ type: String }],
    isTeamEvent: { type: Boolean, default: false },
    teamSize: {
      min: { type: Number },
      max: { type: Number },
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for performance
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ 'organizer.id': 1 });
eventSchema.index({ featured: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
