import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { IUser } from "@/models/user";
import { JWT } from "next-auth/jwt"; 
import { Session, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        await connectDB();
        const { email, password } = credentials;

        const user = (await User.findOne({ email }).exec()) as IUser | null;
        if (!user) throw new Error("No user found with this email");

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid password");

        return { id: user._id.toString(), email: user.email, username: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, 
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: IUser | NextAuthUser  }) {
      if (user) {
        // Ensure user is of type IUser
        if ("_id" in user) {
          token.id = user._id.toString();
          token.email = user.email;
          token.username = (user as IUser).username; // Explicit cast
        } else {
          token.id = user.id;
          token.email = user.email;
          token.username = (user as NextAuthUser).name || ""; // Default username handling
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
