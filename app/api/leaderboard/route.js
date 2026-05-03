import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserProfile from "@/models/UserProfile";
import Habit from "@/models/Habit";
import { createAuth } from "@/lib/auth";

async function getSession(req) {
  const conn = await connectDB();
  const auth = createAuth(conn.connection);
  return auth.api.getSession({ headers: req.headers });
}

// GET /api/leaderboard
export async function GET(req) {
  try {
    await connectDB();

    const leaders = await UserProfile.find({ isPublic: true })
      .sort({ xp: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ leaders });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
