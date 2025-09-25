"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { useGetTermsAndConditionsQuery } from "@/redux/feature/settingAPI";

export default function TermsConditionPage() {
  // const { data: terms, isLoading } = useGetTermsAndConditionsQuery({});

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
                <span className='text-xl font-semibold'>Terms & Condition</span>
              </Link>

              <Link
                href='/setting/terms-condition/edit'
                className='inline-flex items-center text-primary hover:text-teal-700 border border-[#760C2A] rounded-md px-4 py-1.5'
              >
                <span className='text-xl font-semibold'>Edit</span>
              </Link>
            </div>

            <div>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero
              quis veritatis sint, ab saepe illo omnis sed quisquam ad neque
              reiciendis obcaecati quia, sapiente necessitatibus aliquam.
              Recusandae obcaecati qui culpa!
              {/* {terms?.description ? (
                <div
                  className='prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: terms.description }}
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
