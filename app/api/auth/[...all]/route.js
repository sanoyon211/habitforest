import { createAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

let authInstance = null;

async function getAuth() {
  if (!authInstance) {
    const mongooseInstance = await connectDB();
    const db = mongooseInstance.connection.getClient().db();
    authInstance = createAuth(db);
  }
  return authInstance;
}

async function handler(req) {
  try {
    const auth = await getAuth();
    if (req.method === "POST") {
      return await toNextJsHandler(auth).POST(req);
    }
    return await toNextJsHandler(auth).GET(req);
  } catch (error) {
    console.error("Auth Handler Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = handler;
export const POST = handler;
