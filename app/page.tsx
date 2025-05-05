import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl text-blue-50">Hi Cuties✨</div>
      <Link href="/home">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-400 ">
          Click Me
        </button>
      </Link>
    </div>
  );
};

export default page;
