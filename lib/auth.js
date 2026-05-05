import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import connectDB from './db';

export const auth = betterAuth({
  database: mongodbAdapter((await connectDB()).connection.getClient().db()),
  baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === "production" ? "https://habitforest.vercel.app" : "http://localhost:3000"),
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://habitforest.vercel.app",
    process.env.BETTER_AUTH_URL || "",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});