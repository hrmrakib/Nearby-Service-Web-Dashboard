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
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import { useGetOverviewQuery } from "@/redux/features/overview/overviewAPI";
import RecentUser from "@/components/overview/RecentUser";

const StatCard = ({
  title,
  value,
  icon: Icon,
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
  const { data: overviewData } = useGetOverviewQuery({});
  const overview = overviewData?.data;

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='min-h-screen bg-transparent'>
        {/* Main Content */}
        <div className='py-8'>
          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            <StatCard
              title='Total Users'
              value={overview?.totalUsers}
              icon={Users}
            />
            <StatCard
              title='Total Events'
              value={overview?.totalEvents}
              icon={CalendarDays}
            />
            <StatCard
              title='Total Deals'
              value={overview?.totalDeals}
              icon={Handshake}
            />
            <StatCard
              title='Total Services'
              value={overview?.totalServices}
              icon={ClipboardList}
            />
            <StatCard
              title='Total Alerts'
              value={overview?.totalAlerts}
              icon={TriangleAlert}
            />
            <StatCard
              title='Total Reports'
              value={overview?.totalReports}
              icon={ClipboardList}
            />
          </div>

          {/* Recent user */}
          <div>
            <RecentUser />
          </div>
        </div>
      </div>
    </RoleRedirect>
  );
}
