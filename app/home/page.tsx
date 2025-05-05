"use client"
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {  signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    if (!isMounted) return;
    if (status === "loading") return;
    console.log(session);

    setIsMounted(true);
    if (!session) {
      router.push("/login");
    }
  }
    , [isMounted]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };


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
              <h2 className="text-2xl font-semibold">{session?.user.username}</h2>
              <Button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 px-4 py-1 rounded-md">Edit profile</Button>
              <Button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white border border-gray-400 dark:border-gray-600 px-4 py-1 rounded-md">View archive</Button>
            </div>
            <div className="flex gap-6">
              <span><strong>3</strong> posts</span>
              <span><strong>360</strong> followers</span>
              <span><strong>341</strong> following</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Freak<br />nah dude, they call me freak for a reason cutie ✨</p> 
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex gap-4 overflow-x-auto">
          {["random thought", "college ✨", "bday 2022", "cats", "wordy shits"].map((highlight, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-800 dark:text-gray-300">{highlight}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{highlight}</p>
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

      {/* Post Grid */}
      <div className="max-w-4xl w-full grid grid-cols-3 gap-1 px-4">
        <Image
          src="https://images.unsplash.com/photo-1417325384643-aac51acc9e5d"
          alt="Post 1"
          width={400}
          height={400}
          className="w-full h-auto object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1417325384643-aac51acc9e5d"
          alt="Post 2"
          width={400}
          height={400}
          className="w-full h-auto object-cover"
        />
        <Image
          src="https://images.unsplash.com/photo-1417325384643-aac51acc9e5d"
          alt="Post 3"
          width={400}
          height={400}
          className="w-full h-auto object-cover"
        />
      </div>
      <button onClick={handleLogout} className="p-4 bg-purp rounded-full m-5">
        logout
      </button>
    </div>
  );
};

export default ProfilePage;
