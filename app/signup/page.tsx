"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const containsSpaceOrSpecialChars = (str: string): boolean => {
    const regex = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/;
    return regex.test(str);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (containsSpaceOrSpecialChars(formData.username)) {
      setError("Username cannot contain special characters or spaces.");
      return;
    }
    try {
      const res = await axios.post("/api/register", formData);
      if (res.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string; error?: string }>;
      if (axiosError.response?.status === 409 || axiosError.response?.status === 422) {
        setError(axiosError.response.data.message);
        return;
      }
      setError("An error occurred. Please try again.");
      console.error("Registration error:", axiosError.response?.data?.error || axiosError.message);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col md:flex-row items-center gap-[10vw] px-4 sm:px-8 md:px-16 lg:px-24">
        {/* Left side: mockup images */}
        <div className="relative w-[280px] h-[400px] sm:w-[340px] sm:h-[480px] md:w-[380px] md:h-[500px] hidden md:block group">
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[-8deg] z-10 shadow-md left-2 top-10 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[-12deg] group-hover:-translate-y-2">
            <Image
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 1"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[4deg] z-20 shadow-lg left-12 top-6 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[2deg] group-hover:-translate-y-3">
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 2"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="absolute w-[240px] h-[360px] border-4 border-white rotate-[12deg] z-30 shadow-xl left-24 top-2 rounded-lg overflow-hidden transition-transform duration-300 group-hover:rotate-[16deg] group-hover:-translate-y-4">
            <Image
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=250&q=80"
              alt="Polaroid 3"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {/* Right side: signup form */}
        <div className="bg-black p-10 w-full max-w-xs text-sm text-white">
          <h1 className="text-4xl font-logo text-center mb-8">Indelulu</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={formData.username}
              onChange={handleChange}
              required
              type="text"
              name="username"
              placeholder="Username"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {containsSpaceOrSpecialChars(formData.username) && (
              <div className="text-sm pl-1 font-semibold text-red-400">* Username cannot contain special characters or spaces</div>
            )}
            <input
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              name="email"
              placeholder="Email"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              value={formData.password}
              onChange={handleChange}
              required
              type="password"
              name="password"
              placeholder="Password"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            <input
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="bg-zinc-900 border border-gray-700 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
            {error && <div className="text-sm text-red-400 pl-1">{error}</div>}
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded font-semibold mt-1">
              Sign Up
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

          <div className="mt-6 pt-4 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-gray-500 text-xs">
        <p>© made by Freak asa Ashreeta</p>
      </footer>
    </div>
  );
}
