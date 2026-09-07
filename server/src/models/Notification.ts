import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
  email: string;
  createdAt: Date;
  source: 'rsvp_notify';
}

const NotificationSchema = new Schema<INotification>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    source: {
      type: String,
      enum: ['rsvp_notify'],
      default: 'rsvp_notify',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
