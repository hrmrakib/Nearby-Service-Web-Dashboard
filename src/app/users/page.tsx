/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
} from "@/redux/features/user/userAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "@/components/loading/Spinner";

// Updated Interface to match your API response structure where needed
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

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"Post" | "Attending" | "Saved">(
    "Post",
  );
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  // Fetching real data
  const { data: userData, isLoading } = useGetAllUsersQuery({
    page,
    limit: 5,
    search: debouncedSearchTerm,
  });
  const { data: userDetailData, isLoading: isUserDetailLoading } =
    useGetUserByIdQuery(
      {
        id: selectedUser?.id || "",
        params: {
          page: 1,
          limit: 5,
        },
      },
      { skip: !selectedUser?.id },
    );

  const usersFromApi = userData?.data || [];
  const totalPages = userData?.meta?.totalPage || 1;

  const userDetail = userDetailData?.data || [];

  console.log({ selectedUser, userDetail });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleUserClick = (user: any) => {
    // Mapping API response to the User interface for the Modal
    const mappedUser: User = {
      id: user._id,
      name: user.name || "N/A",
      email: user.email,
      avatar: user.image || "/user.png",
      stats: {
        posts: user.post || 0,
        followers: user.follower || 0,
        following: user.following || 0,
      },
      location: user.address || "Unknown Location",
      date: new Date(user.createdAt).toLocaleDateString(),
      time: new Date(user.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Note: If your API provides specific posts/saved items, map them here.
      // Using empty arrays or mock data if those endpoints are separate.
      posts: [],
      attending: [],
      saved: [],
    };

    setSelectedUser(mappedUser);
    setActiveTab("Post");
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case "Post":
        return userDetail.posts?.data || [];
      case "Attending":
        return userDetail.attendingEvents?.data || [];
      case "Saved":
        return userDetail.savedPosts?.data?.filter((s: any) => s.postId) || [];
      default:
        return [];
    }
  };

  if (isLoading)
    return (
      <div className='p-10 text-center text-primary'>Loading users...</div>
    );

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
            <div className='grid grid-cols-4 gap-4 px-6 py-4 font-medium'>
              <div className='text-center text-lg font-medium text-white'>
                SL
              </div>
              <div className='text-center text-lg font-medium text-white'>
                User Name
              </div>
              <div className='text-center text-lg font-medium text-white'>
                Email
              </div>
              <div className='text-center text-lg font-medium text-white'>
                Action
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-border'>
            {usersFromApi?.map((user: any, index: number) => (
              <div
                key={user._id}
                className='grid grid-cols-4 items-center gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors'
              >
                <div className='text-center text-base font-medium text-[#292929]'>
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <div className='text-center text-base font-medium text-[#292929]'>
                  {user.name || "N/A"}
                </div>
                <div className='text-center text-base font-medium text-[#292929]'>
                  {user.email}
                </div>
                <div className='flex items-center justify-center'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 rounded-full text-center hover:bg-secondary'
                    onClick={() => handleUserClick(user)}
                  >
                    <Info className='h-4 w-4 text-[#292929] hover:text-[#17CA2A]' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className='max-w-4xl lg:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-card border-border'>
          {selectedUser && (
            <div className='space-y-6'>
              {/* Profile Header */}
              <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-shrink-0'>
                  <div className='relative'>
                    <Avatar className='h-24 w-24 border-4 border-[#17CA2A]'>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className='text-2xl bg-gray-200 text-[#292929]'>
                        {selectedUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className='mt-4 space-y-2'>
                    <div className='text-2xl font-bold text-[#292929]'>
                      {selectedUser.name}
                    </div>
                    <div className='flex items-center gap-2 text-[#292929]'>
                      <MapPin className='h-4 w-4 text-[#17CA2A]' />
                      <span className='text-sm'>{selectedUser.location}</span>
                    </div>
                    <div className='flex items-center gap-2 text-[#292929] text-sm'>
                      <Calendar className='h-4 w-4 text-[#17CA2A]' />
                      <span>Joined: {selectedUser.date}</span>
                    </div>
                    <div className='text-[#292929] text-sm'>
                      Email: {selectedUser.email}
                    </div>
                  </div>
                </div>

                <div className='flex-1 flex items-center'>
                  <div className='flex gap-10 text-center'>
                    <div>
                      <div className='text-xl font-bold text-[#292929]'>
                        {selectedUser.stats.posts}
                      </div>
                      <div className='text-sm text-[#666]'>Posts</div>
                    </div>
                    <div>
                      <div className='text-xl font-bold text-[#292929]'>
                        {selectedUser.stats.followers}
                      </div>
                      <div className='text-sm text-[#666]'>Followers</div>
                    </div>
                    <div>
                      <div className='text-xl font-bold text-[#292929]'>
                        {selectedUser.stats.following}
                      </div>
                      <div className='text-sm text-[#666]'>Following</div>
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
                        ? "border-[#17CA2A] text-[#15B826] font-medium"
                        : "border-transparent text-[#292929] hover:text-[#17CA2A]"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>

              {/* Content Grid */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {isUserDetailLoading && (
                  <div className='col-span-3'>
                    <div className='flex items-center justify-center h-20'>
                      <Spinner />
                    </div>
                  </div>
                )}

                {getActiveContent().length > 0 && !isUserDetailLoading ? (
                  getActiveContent().map((item: any) => (
                    <div
                      key={item._id}
                      className='bg-secondary/30 rounded-xl overflow-hidden hover:shadow-lg transition-shadow'
                    >
                      <Image
                        src={
                          activeTab === "Saved"
                            ? "/placeholder.svg"
                            : item.image || "/placeholder.svg"
                        }
                        width={400}
                        height={400}
                        alt={activeTab === "Saved" ? "Saved post" : item.title}
                        className='w-full h-48 object-cover'
                      />
                      <div className='p-4 space-y-3'>
                        {activeTab !== "Saved" && (
                          <>
                            <h3 className='font-semibold text-[#292929]'>
                              {item.title}
                            </h3>
                            <div className='flex items-center gap-4 text-sm text-[#292929]'>
                              <div className='flex items-center gap-1'>
                                <MapPin className='h-3 w-3' />
                                <span className='truncate'>{item.address}</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                <span>
                                  <Eye className='h-3 w-3' />
                                </span>
                                <span>{item.views}</span>
                              </div>
                            </div>
                            <p className='text-sm text-[#292929] line-clamp-3'>
                              {item.description}
                            </p>
                          </>
                        )}
                        {activeTab === "Saved" && (
                          <p className='text-sm text-[#292929]'>
                            Post ID: {item.postId?._id}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-3 py-10 text-center text-gray-500'>
                    {!isUserDetailLoading && (
                      <p>No {activeTab.toLowerCase()} content found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <GlobalPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
