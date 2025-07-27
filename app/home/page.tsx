"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Skeleton from "@/components/skeleton/homeskele";
import ImageUploadModal from '@/components/ImageUploadModal';
import PostModal from "@/components/post-modal";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userData, setUserData] = useState({ username: "Loading..." });
  const [IsError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  if (status === "unauthenticated") {
      router.push("/login");
    }

  useEffect(() => {
    setIsMounted(true);
    setIsError(false);
    if (!isMounted || status !== "authenticated" || !session?.user?.id) return;
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        //full get request url is : http://localhost:3000/api/fetch-home-user-data?id=123&username=abc&email=xyz
        const response = await axios.get("/api/fetch-home-user-data", {
          params: {
            id: session?.user.id,
          },
        });
        setUserData(response.data);
        setIsLoading(false);
        return response.data;
      } catch (error) {
        setIsError(true);
        console.error("Error fetching user data:", error);
        setUserData({ username: "error" });
        return null;
      }
    };

    fetchUserData();
  }, [session, isMounted]);

  if (isLoading) return <Skeleton />;
  if (!isMounted) return null;
  if (status === "loading") return <Skeleton />;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  if (IsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-2xl">Error fetching user data</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-white dark:bg-black text-black dark:text-white min-h-screen">
      {/* Profile Header */}
      <div className="max-w-4xl w-full px-4 py-8 flex flex-col gap-6">
        <div className="flex items-center gap-8">
          {/* Profile Image */}
          <Avatar className="w-32 h-32">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold">{userData.username}</h2>
              <Button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 px-4 py-1 rounded-md">
                Edit profile
              </Button>
              <Button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 px-4 py-1 rounded-md">
                View archive
              </Button>
            </div>
            <div className="flex gap-6">
              <span>
                <strong>{userData.posts.length}</strong> posts
              </span>
              <span>
                <strong>{userData.followers.length}</strong> followers
              </span>
              <span>
                <strong>{userData.following.length}</strong> following
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {userData.bio || "No bio yet 😢"}
            </p>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex gap-4 overflow-x-auto">
          {[
            "random thought",
            "college ✨",
            "bday 2022",
            "cats",
            "wordy shits",
          ].map((highlight, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-800 dark:text-gray-300">
                  {highlight}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {highlight}
              </p>
            </div>
          ))}
          {/* Add New Highlight */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center">
              <span className="text-lg">+</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">New</p>
          </div>
        </div>
      </div>

      {/* Image Uploader */}
      <div className="max-w-4xl w-full px-4 py-8">
        <Button onClick={() => setOpen(true)}>Create Post</Button>
        <ImageUploadModal
          open={open}
          onOpenChange={setOpen}
          userName={userData.username}
        />
      </div>

      {/* Post Grid (***********REMEMBER TO USE RESIZABLE HERE*************) */}
      <div className="max-w-4xl w-full grid grid-cols-3 gap-1 px-4">
        {userData.posts.map((post, index) => (
          <Image
            key={index}
            src={post.link}
            alt={`Post ${index + 1}`}
            width={400}
            height={400}
            className="w-4xl h-3/4 object-cover"
            onClick={() => setSelectedPost(post)}
          />
        ))}
      </div>
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
      <button onClick={handleLogout} className="p-4 bg-purp rounded-full m-5">
        logout
      </button>
    </div>
  );
};

export default ProfilePage;
