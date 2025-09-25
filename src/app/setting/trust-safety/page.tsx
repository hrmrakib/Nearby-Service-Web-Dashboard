"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { useGetTrustAndSafetyQuery } from "@/redux/feature/settingAPI";
import { useEffect } from "react";

export default function TrustAndSafetyPage() {
  // const {
  //   data: trustAndSafety,
  //   isLoading,
  //   refetch,
  // } = useGetTrustAndSafetyQuery({});

  // useEffect(() => {
  //   refetch();
  // }, [trustAndSafety]);

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1 w-full'>
        <main className='w-full p-4 md:p-6'>
          <div className='max-w-3xl mx-auto'>
            <div className='mb-6 flex items-center justify-between'>
              <Link
                href='/setting'
                className='inline-flex items-center text-primary hover:text-teal-700'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                <span className='text-xl font-semibold'>Trust & Safety</span>
              </Link>

              <Link
                href='/setting/trust-safety/edit'
                className='inline-flex items-center text-primary hover:text-teal-700 border border-[#760C2A] rounded-md px-4 py-1.5'
              >
                <span className='text-xl font-semibold'>Edit</span>
              </Link>
            </div>

            <div className='prose prose-sm max-w-none'>
              <h2 className='text-xl font-semibold mb-4'>Trust and Safety</h2>
            </div>

            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias error eligendi totam quasi fugit, recusandae ipsa necessitatibus molestias similique tempora, laudantium placeat harum quidem, maiores quo cum aliquam dignissimos architecto!
              {/* {trustAndSafety?.description ? (
                <div
                  className='prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: trustAndSafety.description,
                  }}
                />
              ) : (
                <p>Loading content...</p>
              )} */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
