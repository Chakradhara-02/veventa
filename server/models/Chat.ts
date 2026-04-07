import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for performance
chatSchema.index({ eventId: 1, timestamp: -1 });
chatSchema.index({ senderId: 1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
