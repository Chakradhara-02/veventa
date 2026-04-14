import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id: mongoose.Types.ObjectId;
  author: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  text: string;
  createdAt: Date;
}

export interface IMemory extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  eventTitle: string;
  author: {
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
  };
  type: 'photo' | 'video';
  url: string;
  caption: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  comments: IComment[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const memorySchema = new Schema<IMemory>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true },
    author: {
      id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      avatar: { type: String },
    },
    type: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
    },
    url: { type: String, required: true },
    caption: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for performance
memorySchema.index({ eventId: 1 });
memorySchema.index({ 'author.id': 1 });
memorySchema.index({ timestamp: -1 });

export const Memory = mongoose.model<IMemory>('Memory', memorySchema);
