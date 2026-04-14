import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupMember {
  id: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
  role: 'leader' | 'member';
}

export interface IGroup extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  name: string;
  members: IGroupMember[];
  interests: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const memberSchema = new Schema<IGroupMember>(
  {
    id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member',
    },
  },
  { _id: false }
);

const groupSchema = new Schema<IGroup>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    members: [memberSchema],
    interests: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Indexes for performance
groupSchema.index({ eventId: 1 });
groupSchema.index({ 'members.id': 1 });

export const Group = mongoose.model<IGroup>('Group', groupSchema);
