import { Schema, model, Document } from 'mongoose';

export type AttendingStatus = 'yes' | 'no' | 'maybe';

export interface IRsvp extends Document {
  name: string;
  email: string;
  attending: AttendingStatus;
  guestCount: number;
  dietaryRestrictions?: string;
  songRequest?: string;
  message?: string;
  submittedAt: Date;
}

const RsvpSchema = new Schema<IRsvp>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    attending: {
      type: String,
      enum: ['yes', 'no', 'maybe'],
      required: [true, 'Attending status is required'],
    },
    guestCount: {
      type: Number,
      required: true,
      min: [1, 'Guest count must be at least 1'],
      max: [10, 'Please contact us directly for groups larger than 10'],
      default: 1,
    },
    dietaryRestrictions: {
      type: String,
      maxlength: [500, 'Dietary restrictions cannot exceed 500 characters'],
    },
    songRequest: {
      type: String,
      maxlength: [200, 'Song request cannot exceed 200 characters'],
    },
    message: {
      type: String,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    submittedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick admin lookup
RsvpSchema.index({ email: 1 });
RsvpSchema.index({ attending: 1 });

export const Rsvp = model<IRsvp>('Rsvp', RsvpSchema);
