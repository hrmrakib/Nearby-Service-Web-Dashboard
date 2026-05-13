"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useGetProfileQuery } from "@/redux/features/settings/settingsAPI";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component

const Header = () => {
  const [admin, setAdmin] = useState({
    name: "",
    role: "",
    image: "",
  });

  const { data: profileData, isLoading } = useGetProfileQuery({});
  const profile = profileData?.data;

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

  // Auth page check
  const isAuthPage = [
    "/signup",
    "/login",
    "/forgot-password",
    "/verify-password",
    "/verify-otp",
    "/reset-password",
  ].includes(pathname);

  if (isAuthPage) return null;

  return (
    <div className='bg-white border-b border-gray-200 rounded-2xl mb-6'>
      <div className='max-w-8xl mx-auto px-6'>
        <div className='flex items-center justify-between py-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
              Welcome,{" "}
              {isLoading ? <Skeleton className='h-8 w-32' /> : admin.name}
            </h1>
            <p className='text-gray-600 mt-1'>Have a nice day</p>
          </div>

          <div className='flex items-center gap-4'>
            <Link
              href='/setting/personal-information'
              className='flex items-center gap-3'
            >
              <div className='relative'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={admin.image} alt={admin.name} />
                  <AvatarFallback>
                    {admin.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                {isLoading && (
                  <Skeleton className='absolute inset-0 rounded-full h-10 w-10' />
                )}
              </div>

              <div className='hidden sm:block min-w-[100px]'>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                ) : (
                  <>
                    <p className='text-base font-medium text-[#333338]'>
                      {admin.name}
                    </p>
                    <p className='text-sm text-[#606060]'>{admin.role}</p>
                  </>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
