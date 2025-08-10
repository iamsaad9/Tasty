import mongoose from "mongoose";
import UserModel, { IUser } from "@/../models/user";

// 1️⃣ DB connection (reusable)
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGO_URI!);
  isConnected = true;
}

// 2️⃣ CRUD functions for Users
export async function getUsers() {
  await connectDB();
  return UserModel.find();
}

export async function createUser(data: Partial<IUser>) {
  await connectDB();
  return UserModel.create(data);
}

export async function updateUser(id: string, data: Partial<IUser>) {
  await connectDB();
  return UserModel.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteUser(id: string) {
  await connectDB();
  return UserModel.findByIdAndDelete(id);
}

// 3️⃣ You can add more functions for menu, orders, etc., in the same file
