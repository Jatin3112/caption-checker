import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    requests: { type: Number, default: 0 },

    verifyEmailToken: { type: String, default: null },
    verified: { type: Boolean, default: false },

    plan: {
      type: String,
      enum: ["free", "starter", "pro", "elite"],
      default: "free",
    },

    resetToken: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
