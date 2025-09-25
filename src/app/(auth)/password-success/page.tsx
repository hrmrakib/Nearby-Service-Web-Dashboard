"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PasswordSuccessPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className='min-h-screen bg-orange-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative'>
        {/* Back Button */}
        <button
          onClick={handleBack}
          className='absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors'
        >
          <ArrowLeft className='w-5 h-5 text-gray-600' />
        </button>

        {/* Logo */}
        <div className='flex items-center justify-center text-center'>
          <Image src='/logo.png' alt='Logo' width={200} height={200} />
        </div>

        {/* Title */}
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-3 leading-tight'>
            Password Updated
            <br />
            Successfully!
          </h1>
          <p className='text-gray-600 text-sm leading-relaxed'>
            Your new password has beet saved. You can now continue securely.
          </p>
        </div>

        {/* Sign In Button */}
        <Button
          onClick={handleSignIn}
          className='w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors'
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
