// models/user.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  image?: string | null; // Optional profile image
  password?: string; // Optional for social logins
  role: "user" | "admin";
  provider?: string; // For social logins
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if it's not a social login
        return !this.provider;
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google", "facebook", "credentials"],
      default: "credentials",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation in development
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;