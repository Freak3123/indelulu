import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    console.log("POST request made to /api/register");

    const { username, email, password }: { username: string; email: string; password: string } =
      await request.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingUser || existingUsername) {
      return NextResponse.json({ message: "*Username or email already exists" }, { status: 409 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "*Password must be at least 8 characters!" }, { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: "User Registered", user }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
