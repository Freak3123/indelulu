"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const router = useRouter();
  const { status } = useSession();
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login", formData);
      if (res.status === 200) {
        setInvalidCredentials(false);
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error instanceof Error && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          setInvalidCredentials(true);
        }
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col md:flex-row items-center gap-[10vw] px-4 sm:px-8 md:px-16 lg:px-24">
        {/* Left side: mockup images */}
        <div className="relative w-[280px] h-[400px] sm:w-[340px] sm:h-[480px] md:w-[380px] md:h-[500px] hidden md:block group">
          {/* Card 1 */}
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[-8deg] z-10 shadow-md left-2 top-10 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:-translate-y-2">
            <Image
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 1"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Card 2 */}
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[4deg] z-20 shadow-lg left-12 top-6 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[2deg] group-hover:-translate-y-3">
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 2"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Card 3 */}
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[12deg] z-30 shadow-xl left-24 top-2 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[16deg] group-hover:-translate-y-4">
            <Image
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 3"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Right side: login form */}
        <div className="bg-black p-10 w-full max-w-xs text-sm text-white">
          {/* Logo or text */}
          <h1 className="text-4xl font-logo text-center mb-8">Indelulu</h1>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col gap-3"
          >
            <input
              value={formData.email}
              onChange={handleChange}
              required
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              value={formData.password}
              onChange={handleChange}
              required
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {invalidCredentials && <div className="text-sm pl-1 font-semibold text-red-400">* Invalid credentials</div>}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded font-semibold mt-1"
            >
              Log In
            </button>
            <div className="text-center text-sm text-gray-400 mt-4">
              By signing up, you agree to the{" "}
              <Link href="#" className="text-blue-500 font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-500 font-medium">
                Privacy Policy
              </Link>
              .
            </div>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-2 my-4 text-gray-500 text-xs">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span>OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div> */}

          {/* Facebook login */}
          {/* <button className="flex items-center justify-center gap-2 text-blue-400 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 12a10 10 0 1 0-11.5 9.87v-7H8v-2.87h2.5V9.5c0-2.5 1.5-3.88 3.77-3.88 1.1 0 2.25.2 2.25.2v2.48H15.5c-1.24 0-1.62.78-1.62 1.58v1.87H18l-.5 2.87h-2v7A10 10 0 0 0 22 12z" />
            </svg>
            Log in with Facebook
          </button> */}

          {/* Forgot password */}
          {/* <div className="text-center mt-3 text-blue-500 text-xs cursor-pointer">
            Forgot password?
          </div>  */}

          {/* Sign up link */}
          <div className="mt-6 pt-4 text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-gray-500 text-xs">
        <p>© made by Freak asa Ashreeta</p>
      </footer>
    </div>
  );
}
