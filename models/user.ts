const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
