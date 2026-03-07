/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser, userTrack } from "@/redux/features/auth/authSlice";
import { saveTokens } from "@/service/authService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const email = formData.email;
    const password = formData.password;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res?.ok) {
        dispatch(userTrack());
        dispatch(
          setUser({
            user: data?.data?.user,
            token: data?.data?.accessToken,
          }),
        );
        await saveTokens(data?.data?.accessToken);
        localStorage.setItem("accessToken", data?.data?.accessToken);
        router.push("/");
      } else {
        toast.error(data?.message);
      }

      console.log(await res.json());
    } catch (err: any) {
      console.log({ err });
      // toast.error(err?.data?.message);
      // setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[90vh] bg-[#F4F5FA] flex items-center justify-center p-4'>
      <Card className='w-full max-w-md bg-white shadow-lg border-0'>
        <CardContent className='pb-8'>
          {/* Logo */}
          <div className='flex flex-col items-center justify-center text-center'>
            <Image
              src='/auth-logo.png'
              alt='Logo'
              width={200}
              height={200}
              className='w-32 h-24'
            />
          </div>

          {/* Header */}
          <div className='text-center my-5'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Welcome back!
            </h1>
            <p className='text-[#8B8D97] text-sm leading-relaxed'>
              Login to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Address */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-gray-700 font-medium'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='Min 8 character'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10  h-12 rounded-xl pr-10 bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B8D97]'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm'>{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='text-right'>
              <Link
                href='/forgot-password'
                className='text-[#5570F1] text-sm hover:text-[#5570F1] transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full h-12 bg-[#15B826] hover:bg-[#0fca22] text-white font-medium py-3 rounded-lg transition-colors'
            >
              {isLoading ? "Logining..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
