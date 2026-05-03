import { createAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

let authInstance = null;

async function getAuth() {
  if (!authInstance) {
    const conn = await connectDB();
    authInstance = createAuth(conn.connection);
  }
  return authInstance;
}

async function handler(req) {
  const auth = await getAuth();
  if (req.method === "POST") {
    return toNextJsHandler(auth).POST(req);
  }
  return toNextJsHandler(auth).GET(req);
}

export const GET = handler;
export const POST = handler;
