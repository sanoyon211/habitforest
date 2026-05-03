import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Habit from "@/models/Habit";
import UserProfile from "@/models/UserProfile";
import { createAuth } from "@/lib/auth";

async function getSession(req) {
  const conn = await connectDB();
  const auth = createAuth(conn.connection);
  return auth.api.getSession({ headers: req.headers });
}

// GET /api/habits — fetch all habits for logged-in user
export async function GET(req) {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const habits = await Habit.find({ userId: session.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ habits });
  } catch (err) {
    console.error("GET /api/habits error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/habits — create a new habit
export async function POST(req) {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, icon, color, frequency } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
    }

    await connectDB();
    const habit = await Habit.create({
      userId: session.user.id,
      name: name.trim(),
      description: description?.trim() || "",
      icon: icon || "🌱",
      color: color || "#00ff88",
      frequency: frequency || "daily",
    });

    return NextResponse.json({ habit }, { status: 201 });
  } catch (err) {
    console.error("POST /api/habits error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
