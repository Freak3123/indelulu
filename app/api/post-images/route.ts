import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import Post from "@/models/posts";

export async function POST(req: NextRequest) {
  try {
    const { userName, url } = await req.json();
    console.log("Received data:", { userName, url });

    if (!userName || !url) {
      return NextResponse.json({ success: false, error: "Missing userName or url" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ username:userName });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const newPost = await Post.create({
      link: url,
      caption: "",
      user: user._id
    });

    user.posts.push(newPost._id);
    await user.save();

    return NextResponse.json({ success: true, postId: newPost._id }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user posts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
