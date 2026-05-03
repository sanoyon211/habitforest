import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    icon: {
      type: String,
      default: "🌱",
    },
    color: {
      type: String,
      default: "#00ff88",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    targetDays: {
      type: Number,
      default: 66, // average habit formation days
    },
    completedDates: {
      type: [String], // ISO date strings "YYYY-MM-DD"
      default: [],
    },
    streak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    treeType: {
      type: String,
      enum: ["🌱", "🌿", "🌲", "🌳", "🌴", "🎋", "🎄"],
      default: "🌱",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Calculate streak helper
HabitSchema.methods.calculateStreak = function () {
  if (!this.completedDates.length) return 0;
  const sorted = [...this.completedDates].sort((a, b) => new Date(b) - new Date(a));
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const today = new Date(now.getTime() - tzOffset).toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 86400000 - tzOffset).toISOString().split("T")[0];

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i - 1]) - new Date(sorted[i])) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

// Tree evolution based on streak
HabitSchema.methods.getTreeStage = function () {
  const streak = this.streak;
  if (streak >= 60) return "🌴";
  if (streak >= 30) return "🌳";
  if (streak >= 14) return "🌲";
  if (streak >= 7) return "🌿";
  if (streak >= 3) return "🌱";
  return "🌱";
};

export default mongoose.models.Habit || mongoose.model("Habit", HabitSchema);
