import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    console.log("POST request made to /api/login");

    const { email, password }: { email: string; password: string } = await request.json();

    await connectDB();
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Successful Login" }, { status: 200 });

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
