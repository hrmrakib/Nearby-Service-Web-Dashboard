/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/redux/features/user/userAPI";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "@/components/loading/Spinner";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import { useGetOverviewQuery } from "@/redux/features/overview/overviewAPI";
import GlobalPagination from "../pagination/GlobalPagination";

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
}

// Per-tab page state
interface TabPages {
  Post: number;
  Attending: number;
  Saved: number;
}

const LIMIT = 9;

export default function RecentUser() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"Post" | "Attending" | "Saved">(
    "Post",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [overviewPage, setOverviewPage] = useState(1);

  // Separate page per tab so switching tabs doesn't reset other tabs' pagination
  const [tabPages, setTabPages] = useState<TabPages>({
    Post: 1,
    Attending: 1,
    Saved: 1,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const { data: overviewData, isLoading } = useGetOverviewQuery({
    searchTerm: debouncedSearchTerm,
  });
  const overview = overviewData?.data;
  const recentUsers = overview?.recentUsers || [];

  const { data: userDetailData, isLoading: isUserDetailLoading } =
    useGetUserByIdQuery(
      {
        id: selectedUser?.id || "",
        params: {
          page: tabPages[activeTab],
          limit: LIMIT,
        },
      },
      { skip: !selectedUser?.id },
    );

  const userDetail = userDetailData?.data;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getActiveContent = (): any[] => {
    if (!userDetail) return [];
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

  // Pull the meta for whichever tab is active
  const getActiveMeta = (): { page: number; totalPage: number } | null => {
    if (!userDetail) return null;
    switch (activeTab) {
      case "Post":
        return userDetail.posts?.meta ?? null;
      case "Attending":
        return userDetail.attendingEvents?.meta ?? null;
      case "Saved":
        return userDetail.savedPosts?.meta ?? null;
      default:
        return null;
    }
  };

  const handleTabPageChange = (newPage: number) => {
    setTabPages((prev) => ({ ...prev, [activeTab]: newPage }));
  };

  const handleTabSwitch = (tab: "Post" | "Attending" | "Saved") => {
    setActiveTab(tab);
    // Pages for other tabs are preserved; only the selected tab's page is used in the query
  };

  const handleUserClick = (user: any) => {
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
    };

    setSelectedUser(mappedUser);
    setActiveTab("Post");
    // Reset all tab pages when opening a new user
    setTabPages({ Post: 1, Attending: 1, Saved: 1 });
  };

  const activeMeta = getActiveMeta();

  // ── Overview pagination (table of users) ─────────────────────────────────────
  const overviewTotalPages = overview?.meta?.totalPage ?? 1;

  if (isLoading)
    return (
      <div className='p-10 text-center text-primary'>Loading users...</div>
    );

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='min-h-screen bg-background !rounded-2xl mt-10'>
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className='backdrop-blur-sm sticky top-0 z-40'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl font-semibold text-[#292929]'>
                Recent User
              </h1>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#292929] h-4 w-4' />
                <Input
                  placeholder='Search'
                  className='pl-10 w-64 bg-input border-border text-primary'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ── Users table ───────────────────────────────────────────────────── */}
        <div className='container mx-auto py-6'>
          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            {/* Table Header */}
            <div className='bg-[#17CA2A]'>
              <div className='grid grid-cols-4 gap-4 px-6 py-4'>
                {["SL", "User Name", "Email", "Action"].map((h) => (
                  <div
                    key={h}
                    className='text-center text-lg font-medium text-white'
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div className='divide-y divide-border'>
              {recentUsers.map((user: any, index: number) => (
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
                      className='h-6 w-6 rounded-full hover:bg-secondary'
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

        {/* Overview-level pagination (user list) */}
        <GlobalPagination
          currentPage={overviewPage}
          totalPages={overviewTotalPages}
          onPageChange={setOverviewPage}
        />

        {/* ── User detail modal ─────────────────────────────────────────────── */}
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className='max-w-4xl lg:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-card border-border'>
            {selectedUser && (
              <div className='space-y-6'>
                {/* Profile Header */}
                <div className='flex flex-col md:flex-row gap-6'>
                  <div className='flex-shrink-0'>
                    <Avatar className='h-24 w-24 border-4 border-[#17CA2A]'>
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className='text-2xl bg-gray-200 text-[#292929]'>
                        {selectedUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
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
                      {[
                        { label: "Posts", value: selectedUser.stats.posts },
                        {
                          label: "Followers",
                          value: selectedUser.stats.followers,
                        },
                        {
                          label: "Following",
                          value: selectedUser.stats.following,
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className='text-xl font-bold text-[#292929]'>
                            {value}
                          </div>
                          <div className='text-sm text-[#666]'>{label}</div>
                        </div>
                      ))}
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
                      onClick={() => handleTabSwitch(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                {/* Content Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[200px]'>
                  {isUserDetailLoading ? (
                    <div className='col-span-3 flex items-center justify-center h-48'>
                      <Spinner />
                    </div>
                  ) : getActiveContent().length > 0 ? (
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
                          alt={
                            activeTab === "Saved" ? "Saved post" : item.title
                          }
                          className='w-full h-48 object-cover'
                        />
                        <div className='p-4 space-y-3'>
                          {activeTab !== "Saved" ? (
                            <>
                              <h3 className='font-semibold text-[#292929]'>
                                {item.title}
                              </h3>
                              <div className='flex items-center gap-4 text-sm text-[#292929]'>
                                <div className='flex items-center gap-1'>
                                  <MapPin className='h-3 w-3' />
                                  <span className='truncate'>
                                    {item.address}
                                  </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <Eye className='h-3 w-3' />
                                  <span>{item.views}</span>
                                </div>
                              </div>
                              <p className='text-sm text-[#292929] line-clamp-3'>
                                {item.description}
                              </p>
                            </>
                          ) : (
                            <p className='text-sm text-[#292929]'>
                              Post ID: {item.postId?._id}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='col-span-3 py-10 text-center text-gray-500'>
                      <p>No {activeTab.toLowerCase()} content found.</p>
                    </div>
                  )}
                </div>

                {/* ── Per-tab pagination ─────────────────────────────────── */}
                {activeMeta && activeMeta.totalPage > 1 && (
                  <GlobalPagination
                    currentPage={tabPages[activeTab]}
                    totalPages={activeMeta.totalPage}
                    onPageChange={handleTabPageChange}
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleRedirect>
  );
}
