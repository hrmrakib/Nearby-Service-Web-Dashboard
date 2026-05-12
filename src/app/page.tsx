/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  ClipboardList,
  Handshake,
  TriangleAlert,
  Users,
} from "lucide-react";
import UserManagement from "./users/page";

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  isNegative = false,
}: {
  title: string;
  value: string;
  icon: any;
  change?: string;
  isNegative?: boolean;
}) => (
  <Card className='bg-white border-0 shadow-lg'>
    <CardContent className='py-2'>
      <div className='flex items-center gap-4'>
        <div className='w-16 h-16 flex items-center justify-center p-3 bg-[#15833f13] rounded-md'>
          <Icon className='h-6 w-6 text-[#108F1E]' />
        </div>
        <div>
          <p className='text-lg font-medium text-[#374151] mb-1'>{title}</p>
          <p className='text-4xl font-bold text-[#374151]'>{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <div className='min-h-screen bg-transparent'>
      {/* Main Content */}
      <div className='py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard title='Total Users' value='455' icon={Users} />
          <StatCard
            title='Total Events'
            value='23'
            icon={CalendarDays}
            change='13%'
            isNegative={true}
          />
          <StatCard title='Total User' value='230' icon={Handshake} />
          <StatCard
            title='Total Services'
            value='12'
            icon={ClipboardList}
            change='13%'
            isNegative={true}
          />
          <StatCard
            title='Total Alerts'
            value='12'
            icon={TriangleAlert}
            change='13%'
            isNegative={true}
          />
          <StatCard
            title='Total Reports'
            value='12'
            icon={ClipboardList}
            change='13%'
            isNegative={true}
          />
        </div>

        {/* Chart Section */}

        <div>
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
