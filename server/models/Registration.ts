import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  registeredAt: Date;
  status: 'registered' | 'cancelled';
  teamId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    registeredAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
    teamId: { type: Schema.Types.ObjectId, ref: 'Group' },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ userId: 1 });

export const Registration = mongoose.model<IRegistration>('Registration', registrationSchema);
