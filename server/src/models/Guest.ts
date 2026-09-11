import { Schema, model, Document } from "mongoose";

export interface IGuest extends Document {
  firstname: string;
  lastname: string;
}

const GuestSchema = new Schema<IGuest>({
  firstname: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
});

GuestSchema.index(
  { firstname: 1, lastname: 1 },
  { collation: { locale: "en", strength: 2 } },
);

export const Guest = model<IGuest>("Guest", GuestSchema, "guests");
