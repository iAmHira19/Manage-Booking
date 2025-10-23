import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { getAuthenticationResponse } from "./services/getAuthenticationResponse";
import getUserSignUp from "./services/signup";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 4 * 24 * 60 * 60,
  },

  // callbacks: {
  //   async signIn({ user }) {
  //     const existingUser = await getAuthenticationResponse(
  //       user.email.replaceAll(".", "__"),
  //       "123456"
  //     );

  //     if (existingUser?.length > 0) {
  //       return false;
  //     }

  //     user.existingUser = existingUser[0];
  //     return true;
  //   },

  //   async jwt({ token, user }) {
  //     if (user?.existingUser) {
  //       token.existingUser = user.existingUser;
  //     }
  //     return token;
  //   },

  //   async session({ session, token }) {
  //     if (token?.existingUser) {
  //       session.user = {
  //         ...session.user,
  //         ...token.existingUser,
  //       };
  //     }
  //     return session;
  //   },
  // },

  callbacks: {
    async signIn({ user }) {
      // Normalize email
      const emailKey = user.email.replaceAll(".", "__");
      const dummyPassword = user.name;

      let existingUser = await getAuthenticationResponse(
        emailKey,
        dummyPassword
      );

      if (!existingUser || existingUser.length === 0) {
        // Auto register the user
        const signUpPayload = {
          Email: user.email,
          Password: dummyPassword,
          FirstName: user.name?.split(" ")[0] || "Google",
          LastName: user.name?.split(" ")[1] || "User",
          AgentCountry: "PK", // or get country dynamically
          Currency: "PKR", // default currency
          UserName: emailKey,
          UserType: "CONSUMER",
        };

        try {
          const registeredUser = await getUserSignUp(signUpPayload);
          if (!registeredUser) {
            return false; // cancel login
          }
          // Re-check to fetch registered user
          existingUser = await getAuthenticationResponse(
            emailKey,
            dummyPassword
          );
        } catch (e) {
          console.error("Auto-registration failed:", e);
          return false;
        }
      }

      user.existingUser = existingUser[0];
      return true;
    },

    async jwt({ token, user }) {
      if (user?.existingUser) {
        token.existingUser = user.existingUser;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.existingUser) {
        session.user = {
          ...session.user,
          ...token.existingUser,
          // Use the original name from Google to prevent duplication
          user_Name: session.user.name,
        };
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },

  secret: process.env.AUTH_SECRET,
});
