import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export function createAuth(db) {
  return betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APP_URL : "http://localhost:3000",

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    },

    trustedOrigins: [
      "http://localhost:3000",
      process.env.NEXT_PUBLIC_APP_URL || "",
    ],
  });
}
