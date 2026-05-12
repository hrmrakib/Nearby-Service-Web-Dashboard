"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useGetProfileQuery } from "@/redux/features/settings/settingsAPI";

const Header = () => {
  const [admin, setAdmin] = useState({
    name: "Foju Pagla",
    role: "Super admin",
    image: "/admin.jpeg",
  });

  const { data: profileData, isLoading } = useGetProfileQuery({});

  const profile = profileData?.data;

  console.log({ profile });

  useEffect(() => {
    if (profile) {
      setAdmin({
        name: profile.name,
        role: profile.role,
        image: profile.image,
      });
    }
  }, [profile]);

  const pathname = usePathname();

  if (
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-password" ||
    pathname === "/verify-otp" ||
    pathname === "/reset-password"
  ) {
    return null;
  }
  return (
    <div className='bg-white border-b border-gray-200 rounded-2xl mb-6'>
      <div className='max-w-8xl mx-auto px-6'>
        <div className='flex items-center justify-between py-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Welcome, {admin?.name}
            </h1>
            <p className='text-gray-600 mt-1'>Have a nice day</p>
          </div>
          <div className='flex items-center gap-4'>
            <Link href='/' className='relative'>
              <Bell className='h-8 w-8 text-[#17CA2A]' />
              <span className='absolute -top-4 -right-2 p-1 bg-[#E8FAEA] font-medium text-[#17CA2A] text-xs rounded-full'>
                9+
              </span>
            </Link>
            <Link
              href='/setting/personal-information'
              className='flex items-center gap-3'
            >
              <Avatar className='h-10 w-10'>
                <AvatarImage src={admin?.image} alt='Daissy' />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <div className='hidden sm:block'>
                <p className='text-base font-medium text-[#333338]'>
                  {admin?.name}
                </p>
                <p className='text-sm text-[#606060]'>{admin?.role}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
