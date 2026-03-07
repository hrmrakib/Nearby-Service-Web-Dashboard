"use client";

import { useState } from "react";
import { Search, X, MapPin, Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  location: string;
  date: string;
  time: string;
  posts: ContentItem[];
  attending: ContentItem[];
  saved: ContentItem[];
}

interface ContentItem {
  id: string;
  title: string;
  image: string;
  distance: string;
  rating: number;
  description: string;
}

const mockUsers: User[] = [
  {
    id: "01",
    name: "Miracle",
    email: "miracle@example.com",
    avatar: "/user.png",
    stats: { posts: 12, followers: 102, following: 510 },
    location: "Los Angeles, CA",
    date: "21/03/2025",
    time: "09:00pm - 02:00am",
    posts: [
      {
        id: "1",
        title: "Cozy Coffee Spot",
        image: "/post/1.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "2",
        title: "Rainbow Bar",
        image: "/post/2.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "3",
        title: "Live Jazz Night",
        image: "/post/3.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
    ],
    attending: [
      {
        id: "4",
        title: "Cozy Coffee Spot",
        image: "/post/1.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "5",
        title: "Rainbow Bar",
        image: "/post/2.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "6",
        title: "Live Jazz Night",
        image: "/post/3.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
    ],
    saved: [
      {
        id: "7",
        title: "Cozy Coffee Spot",
        image: "/post/1.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "8",
        title: "Rainbow Bar",
        image: "/post/2.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
      {
        id: "9",
        title: "Live Jazz Night",
        image: "/post/3.jpg",
        distance: "2.3 miles",
        rating: 4.9,
        description:
          "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
      },
    ],
  },
  {
    id: "02",
    name: "Haylie",
    email: "paityn@example.com",
    avatar: "/user.png",
    stats: { posts: 8, followers: 89, following: 234 },
    location: "New York, NY",
    date: "22/03/2025",
    time: "08:00pm - 01:00am",
    posts: [],
    attending: [],
    saved: [],
  },
  {
    id: "03",
    name: "Kierra",
    email: "kierra@example.com",
    avatar: "/user.png",
    stats: { posts: 15, followers: 156, following: 678 },
    location: "Chicago, IL",
    date: "23/03/2025",
    time: "07:30pm - 12:30am",
    posts: [],
    attending: [],
    saved: [],
  },
  {
    id: "04",
    name: "Paityn",
    email: "rayna@example.com",
    avatar: "/user.png",
    stats: { posts: 6, followers: 45, following: 123 },
    location: "Miami, FL",
    date: "24/03/2025",
    time: "09:30pm - 02:30am",
    posts: [],
    attending: [],
    saved: [],
  },
  {
    id: "05",
    name: "Anika",
    email: "anika@example.com",
    avatar: "/user.png",
    stats: { posts: 20, followers: 234, following: 890 },
    location: "Seattle, WA",
    date: "25/03/2025",
    time: "08:30pm - 01:30am",
    posts: [],
    attending: [],
    saved: [],
  },
  {
    id: "06",
    name: "Rayna",
    email: "haylie@example.com",
    avatar: "/user.png",
    stats: { posts: 11, followers: 78, following: 345 },
    location: "Austin, TX",
    date: "26/03/2025",
    time: "09:00pm - 02:00am",
    posts: [],
    attending: [],
    saved: [],
  },
  {
    id: "07",
    name: "Justin",
    email: "justin@example.com",
    avatar: "/user.png",
    stats: { posts: 9, followers: 67, following: 234 },
    location: "Denver, CO",
    date: "27/03/2025",
    time: "08:00pm - 01:00am",
    posts: [],
    attending: [],
    saved: [],
  },
];

const susanFlores: User = {
  id: "susan",
  name: "Susan Flores",
  email: "example@gmail.com",
  avatar: "/user.png",
  stats: { posts: 12, followers: 102, following: 510 },
  location: "Los Angeles, CA",
  date: "21/03/2025",
  time: "09:00pm - 02:00am",
  posts: [
    {
      id: "1",
      title: "Cozy Coffee Spot",
      image: "/post/1.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "2",
      title: "Rainbow Bar",
      image: "/post/2.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "3",
      title: "Live Jazz Night",
      image: "/post/3.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
  ],
  attending: [
    {
      id: "4",
      title: "Cozy Coffee Spot",
      image: "/post/1.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "5",
      title: "Rainbow Bar",
      image: "/post/2.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "6",
      title: "Live Jazz Night",
      image: "/post/3.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
  ],
  saved: [
    {
      id: "7",
      title: "Cozy Coffee Spot",
      image: "/post/1.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "8",
      title: "Rainbow Bar",
      image: "/post/2.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
    {
      id: "9",
      title: "Live Jazz Night",
      image: "/post/3.jpg",
      distance: "2.3 miles",
      rating: 4.9,
      description:
        "Shop our summer collection of dresses, now 50% off. Free delivery within 10 miles and 24/7 customer service...",
    },
  ],
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"Post" | "Attending" | "Saved">(
    "Post"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    setSelectedUser(susanFlores);
    setActiveTab("Post");
    console.log(userId);
  };

  const getActiveContent = () => {
    if (!selectedUser) return [];

    switch (activeTab) {
      case "Post":
        return selectedUser.posts;
      case "Attending":
        return selectedUser.attending;
      case "Saved":
        return selectedUser.saved;
      default:
        return selectedUser.posts;
    }
  };

  return (
    <div className='min-h-screen bg-background !rounded-2xl mt-10'>
      <header className='backdrop-blur-sm sticky top-0 z-40'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-xl font-semibold text-[#292929]'>
                Recent User
              </h1>
            </div>

            <div className='flex items-center gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#292929] h-4 w-4' />
                <Input
                  placeholder='Search'
                  className='pl-10 w-64 bg-input border-border'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto py-6'>
        <div className='bg-card border border-border rounded-xl overflow-hidden'>
          {/* Table Header */}
          <div className='bg-[#17CA2A] text-success-foreground'>
            <div className='flex items-center justify-between grid-cols  gap-4 px-6 py-4 font-medium'>
              <div className='px-6 py-1.5 text-center text-lh font-medium text-table-header-color'>
                SL
              </div>
              <div className='px-6 py-1.5 text-center text-lg font-medium text-table-header-color'>
                User Name
              </div>
              <div className='px-6 py-1.5 text-center text-lg font-medium text-table-header-color'>
                Email
              </div>
              <div className='px-6 py-1.5 text-center text-lg font-medium text-table-header-color'>
                Action
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-border'>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className='flex items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors'
              >
                <div className='px-6 py-1.5 text-center text-base font-medium text-[#292929]'>
                  {user.id}
                </div>
                <div
                  className='px-6 py-1.5 text-center text-base font-medium text-[#292929] 
                '
                >
                  {user.name}
                </div>
                <div className='px-6 py-1.5 text-center text-base font-medium text-[#292929]'>
                  {user.email}
                </div>
                <div className='px-6 py-1.5 flex items-center justify-center'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 rounded-full text-center hover:bg-secondary'
                    onClick={() => handleUserClick(user.id)}
                  >
                    <Info className='h-3 w-3 text-[#292929] hover:text-[#17CA2A]' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className='max-w-4xl lg:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-card border-border'>
          <DialogHeader className='relative'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute -top-2 -right-2 h-8 w-8 rounded-full bg-success hover:bg-success/90 text-success-foreground'
              onClick={() => setSelectedUser(null)}
            >
              <X className='h-4 w-4' />
            </Button>
          </DialogHeader>

          {selectedUser && (
            <div className='space-y-6'>
              {/* Profile Header */}
              <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-shrink-0'>
                  <div className='relative'>
                    <Avatar className='h-24 w-24 border-4 border-warning'>
                      <AvatarImage src='/user.png' />
                      <AvatarFallback className='text-2xl bg-warning text-warning-foreground'>
                        SF
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='space-y-2'>
                    <div className='text-2xl font-bold text-[#292929]'>
                      {selectedUser.name}
                    </div>
                    <div className='flex items-center gap-2 text-[#292929]'>
                      <MapPin className='h-4 w-4 text-success' />
                      <span>{selectedUser.location}</span>
                    </div>
                    <div className='flex items-center gap-2 text-[#292929]'>
                      <Calendar className='h-4 w-4 text-success' />
                      <span>
                        {selectedUser.date} | {selectedUser.time}
                      </span>
                    </div>
                    <div className='text-[#292929]'>
                      Email: {selectedUser.email}
                    </div>
                  </div>
                </div>

                <div className='flex-1 space-y-4'>
                  <div className='flex flex-col md:flex-row md:items-center gap-4'>
                    <div className='flex gap-6 text-center'>
                      <div>
                        <div className='text-xl font-bold text-[#292929]'>
                          {selectedUser.stats.posts}
                        </div>
                        <div className='text-sm text-[#292929]'>Posts</div>
                      </div>
                      <div>
                        <div className='text-xl font-bold text-[#292929]'>
                          {selectedUser.stats.followers}
                        </div>
                        <div className='text-sm text-[#292929]'>Followers</div>
                      </div>
                      <div>
                        <div className='text-xl font-bold text-[#292929]'>
                          {selectedUser.stats.following}
                        </div>
                        <div className='text-sm text-[#292929]'>Following</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className='flex gap-1 border-b border-border'>
                {(["Post", "Attending", "Saved"] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant='ghost'
                    className={`px-6 py-2 rounded-none border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-success text-[#15B826] font-medium"
                        : "border-transparent text-[#292929] hover:text-[#292929]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Content Grid */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {getActiveContent().map((item) => (
                  <div
                    key={item.id}
                    className='bg-secondary/30 rounded-xl overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <div className='relative'>
                      <Image
                        width={500}
                        height={500}
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className='w-full h-48 object-cover'
                      />
                    </div>

                    <div className='p-4 space-y-3'>
                      <h3 className='font-semibold text-[#292929]'>
                        {item.title}
                      </h3>

                      <div className='flex items-center gap-4 text-sm text-[#292929]'>
                        <div className='flex items-center gap-1'>
                          <MapPin className='h-3 w-3' />
                          <span>{item.distance}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <span>⭐</span>
                          <span>{item.rating}</span>
                        </div>
                      </div>

                      <p className='text-sm text-[#292929] line-clamp-3'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
