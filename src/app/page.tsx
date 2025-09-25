/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users } from "lucide-react";

// Mock data for the chart
const chartData = {
  thisMonth: [
    { x: "1k", y: 1800 },
    { x: "3k", y: 2800 },
    { x: "6k", y: 2000 },
    { x: "9k", y: 600 },
    { x: "12k", y: 4000 },
    { x: "15k", y: 3800 },
    { x: "18k", y: 1600 },
    { x: "21k", y: 3600 },
    { x: "24k", y: 4200 },
  ],
  lastMonth: [
    { x: "1k", y: 200 },
    { x: "3k", y: 1200 },
    { x: "6k", y: 1600 },
    { x: "9k", y: 800 },
    { x: "12k", y: 2800 },
    { x: "15k", y: 3800 },
    { x: "18k", y: 3200 },
    { x: "21k", y: 3800 },
    { x: "24k", y: 2000 },
  ],
};

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
    <CardContent className='p-'>
      <div className='flex items-center gap-4'>
        <div className='p-3 bg-[#aaa3a34f] rounded-full'>
          <Icon className='h-6 w-6 text-gray-600' />
        </div>
        <div>
          <p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
          <p className='text-2xl font-bold text-gray-900'>{value}</p>
          {change && (
            <p
              className={`text-xs mt-1 ${
                isNegative ? "text-red-500" : "text-green-500"
              }`}
            >
              {isNegative ? "-" : "+"}
              {change} since last day
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const LineChart = ({
  data,
  selectedPeriod,
}: {
  data: any;
  selectedPeriod: string;
}) => {
  const maxY = 4500;
  const chartHeight = 300;
  const chartWidth = 1500;
  const padding = 60;

  const getYPosition = (value: number) => {
    return chartHeight - padding - (value / maxY) * (chartHeight - padding * 2);
  };

  const getXPosition = (index: number, total: number) => {
    return padding + (index * (chartWidth - padding * 2)) / (total - 1);
  };

  const createPath = (points: any[]) => {
    return points
      .map((point, index) => {
        const x = getXPosition(index, points.length);
        const y = getYPosition(point.y);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const thisMonthPath = createPath(data.thisMonth);
  const lastMonthPath = createPath(data.lastMonth);

  return (
    <div className='min-w-full overflow-x-auto'>
      <svg width={chartWidth} height={chartHeight} className='min-w-full'>
        {/* Grid lines */}
        {[0, 1000, 2000, 3000, 4000].map((value) => (
          <g key={value}>
            <line
              x1={padding}
              y1={getYPosition(value)}
              x2={chartWidth - padding}
              y2={getYPosition(value)}
              stroke='#f3f4f6'
              strokeWidth='1'
            />
            <text
              x={padding - 10}
              y={getYPosition(value) + 4}
              textAnchor='end'
              className='text-xs fill-gray-500'
            >
              {value === 0 ? "0" : `${value / 1000}k`}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.thisMonth.map((point: any, index: number) => (
          <text
            key={point.x}
            x={getXPosition(index, data.thisMonth.length)}
            y={chartHeight - padding + 20}
            textAnchor='middle'
            className='text-xs fill-gray-500'
          >
            {point.x}
          </text>
        ))}

        {/* This Month line */}
        <path
          d={thisMonthPath}
          fill='none'
          stroke='#f59e0b'
          strokeWidth='2'
          className='drop-shadow-sm'
        />

        {/* Last Month line */}
        <path
          d={lastMonthPath}
          fill='none'
          stroke='#3b82f6'
          strokeWidth='2'
          className='drop-shadow-sm'
        />

        {/* Data points for This Month */}
        {data.thisMonth.map((point: any, index: number) => (
          <g key={`this-${index}`}>
            <circle
              cx={getXPosition(index, data.thisMonth.length)}
              cy={getYPosition(point.y)}
              r='4'
              fill='#f59e0b'
              className='drop-shadow-sm'
            />
            {point.y === 4000 && (
              <g>
                <rect
                  x={getXPosition(index, data.thisMonth.length) - 20}
                  y={getYPosition(point.y) - 35}
                  width='40'
                  height='20'
                  rx='10'
                  fill='#f59e0b'
                />
                <text
                  x={getXPosition(index, data.thisMonth.length)}
                  y={getYPosition(point.y) - 22}
                  textAnchor='middle'
                  className='text-xs fill-white font-medium'
                >
                  $2,714
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Data points for Last Month */}
        {data.lastMonth.map((point: any, index: number) => (
          <circle
            key={`last-${index}`}
            cx={getXPosition(index, data.lastMonth.length)}
            cy={getYPosition(point.y)}
            r='4'
            fill='#3b82f6'
            className='drop-shadow-sm'
          />
        ))}
      </svg>
    </div>
  );
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");

  const periods = ["Day", "Week", "Month", "Year"];

  return (
    <div className='min-h-screen bg-transparent'>
      {/* Main Content */}
      <div className='py-8'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard title='Total Revenue' value='$235.5' icon={BarChart3} />
          <StatCard
            title="Today's Revenue"
            value='$235.5'
            icon={BarChart3}
            change='13%'
            isNegative={true}
          />
          <StatCard title='Total User' value='230' icon={Users} />
          <StatCard
            title="Today's New User"
            value='12'
            icon={Users}
            change='13%'
            isNegative={true}
          />
        </div>

        {/* Chart Section */}
        <Card className=' bg-white border-0 shadow-sm'>
          <CardContent className='p-6'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Statistics</p>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Payment received.
                </h2>
              </div>
              <div className='flex items-center gap-6 mt-4 sm:mt-0'>
                {/* Legend */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-amber-500'></div>
                    <span className='text-sm text-gray-600'>This Month</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                    <span className='text-sm text-gray-600'>Last Month</span>
                  </div>
                </div>
                {/* Period Selector */}
                <div className='flex bg-gray-100 rounded-lg p-1'>
                  {periods.map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setSelectedPeriod(period)}
                      className={`text-xs px-3 py-1 ${
                        selectedPeriod === period
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <LineChart data={chartData} selectedPeriod={selectedPeriod} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
