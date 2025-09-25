"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Sign up data:", formData);
      // Handle successful signup (redirect, show success message, etc.)
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-orange-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-xl bg-white shadow-lg border-0'>
        <CardContent className='pb-8'>
          {/* Logo */}
          <div className='flex items-center justify-center text-center'>
            <Image src='/logo.png' alt='Logo' width={200} height={200} />
          </div>

          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>Sign up</h1>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Create an account and verify your personal account to access our
              valuable and exclusives feature.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Full Name */}
            <div className='space-y-2'>
              <Label htmlFor='fullName' className='text-gray-700 font-medium'>
                Full Name
              </Label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  id='fullName'
                  name='fullName'
                  type='text'
                  placeholder='Enter your name'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`pl-10 bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className='text-red-500 text-sm'>{errors.fullName}</p>
              )}
            </div>

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
                  className={`pl-10 bg-gray-50 border-gray-200 focus:bg-white ${
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
                  className={`pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
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
                href='/auth/forgot-password'
                className='text-orange-500 text-sm hover:text-orange-600 transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign Up Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors'
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </Button>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>Or</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className='text-center'>
              <span className='text-gray-600 text-sm'>
                Already have an account?{" "}
                <Link
                  href='/auth/signin'
                  className='text-orange-500 hover:text-orange-600 font-medium transition-colors'
                >
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
