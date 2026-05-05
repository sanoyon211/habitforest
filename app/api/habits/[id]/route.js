import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Habit from "@/models/Habit";
import UserProfile from "@/models/UserProfile";
import { auth } from "@/lib/auth";

async function getSession(req) {
  return auth.api.getSession({ headers: req.headers });
}

// PATCH /api/habits/[id]/complete — toggle today's completion
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const session = await getSession(req);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const habit = await Habit.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const alreadyDone = habit.completedDates.includes(today);

    if (alreadyDone) {
      habit.completedDates = habit.completedDates.filter((d) => d !== today);
    } else {
      habit.completedDates.push(today);
    }

    // Recalculate streak
    habit.streak = habit.calculateStreak();
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }

    // Update tree type based on streak
    habit.treeType = habit.getTreeStage();

    await habit.save();

    // Update user XP if completing (not un-completing)
    if (!alreadyDone) {
      await UserProfile.findOneAndUpdate(
        { userId: session.user.id },
        {
          $inc: { totalHabitsCompleted: 1, xp: 10 + habit.streak },
          $set: {
            totalTrees: await Habit.countDocuments({
              userId: session.user.id,
              "completedDates.0": { $exists: true },
            }),
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ habit, completed: !alreadyDone });
  } catch (err) {
    console.error("PATCH /api/habits/[id]/complete error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/habits/[id] — soft delete
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getSession(req);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await Habit.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { isActive: false }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
