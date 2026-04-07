import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'participant' | 'organizer' | 'admin';
  bio?: string;
  interests: string[];
  joinDate: Date;
  eventsAttended: number;
  eventsCreated?: number;
  lastSignedIn: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    avatar: { type: String },
    role: {
      type: String,
      enum: ['participant', 'organizer', 'admin'],
      default: 'participant',
    },
    bio: { type: String },
    interests: [{ type: String }],
    joinDate: { type: Date, default: Date.now },
    eventsAttended: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    lastSignedIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password!, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password || '');
};

// Index for email lookup
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
