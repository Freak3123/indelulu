import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import "@/models/posts";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  await connectDB();

  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("posts")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User data fetched successfully:", user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
