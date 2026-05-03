import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    totalTrees: {
      type: Number,
      default: 0,
    },
    totalHabitsCompleted: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    forestTheme: {
      type: String,
      enum: ["default", "winter", "autumn", "tropical", "night"],
      default: "default",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UserProfileSchema.methods.getLevel = function () {
  // 100 XP per level, exponential scaling
  return Math.floor(Math.sqrt(this.xp / 100)) + 1;
};

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);
