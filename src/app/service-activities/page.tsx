"use client";

import { useState } from "react";
import { Eye, Bookmark, Heart, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import {
  useGetAllBlockPostQuery,
  useGetAllPublishedPostQuery,
  useGetAllSuspeciousPostQuery,
} from "@/redux/features/serviceAct/serviceActivities";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

// ── API shape ──────────────────────────────────────────────────────────────
interface ApiPost {
  _id: string;
  author: string;
  image: string | null;
  media: string[] | null;
  title: string;
  description: string;
  startDate: string | null;
  startTime: string | null;
  endDate: string | null;
  address: string;
  hasTag: string[];
  views: number;
  likes: number;
  totalSaved: number;
  price: number | null;
  capacity: number | null;
  attenders: string[];
  category: string;
  subcategory: string | null;
  serviceArea: string;
  status: string;
  boost: boolean;
  schedule: { day: string; startTime: string; endTime: string; _id: string }[];
  contactInfo: string | null;
  expireLimit: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; totalPage: number; total: number };
  data: ApiPost[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const PLACEHOLDER = "/placeholder.svg";

// ── Tabs config ────────────────────────────────────────────────────────────
const TABS = [
  { id: "publish", label: "Publish" },
  { id: "suspicious", label: "Suspicious" },
  { id: "block", label: "Block" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Status badge colours ───────────────────────────────────────────────────
const statusColour: Record<string, string> = {
  PUBLISHED: "bg-green-500",
  SUSPICIOUS: "bg-yellow-500",
  BLOCKED: "bg-red-500",
};

// ── Component ──────────────────────────────────────────────────────────────
export default function EventPlatform() {
  const [activeTab, setActiveTab] = useState<TabId>("publish");
  const [selectedPost, setSelectedPost] = useState<ApiPost | null>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: publishedData, isLoading: loadingPublished } =
    useGetAllPublishedPostQuery({
      page,
      limit,
    });
  const { data: suspiciousData, isLoading: loadingSuspicious } =
    useGetAllSuspeciousPostQuery({ page, limit });
  const { data: blockData, isLoading: loadingBlock } = useGetAllBlockPostQuery({
    page,
    limit,
  });
  const totalPages =
    activeTab === "publish"
      ? publishedData?.meta.totalPage
      : activeTab === "suspicious"
        ? suspiciousData?.meta.totalPage
        : blockData?.meta.totalPage;

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Pick the right dataset for the active tab
  const dataMap: Record<
    TabId,
    { res: ApiResponse | undefined; loading: boolean }
  > = {
    publish: { res: publishedData, loading: loadingPublished },
    suspicious: { res: suspiciousData, loading: loadingSuspicious },
    block: { res: blockData, loading: loadingBlock },
  };

  const { res, loading } = dataMap[activeTab];
  const posts: ApiPost[] = res?.data ?? [];

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='min-h-screen bg-transparent mt-6'>
        <div className='container mx-auto py-6'>
          {/* ── Tabs ── */}
          <div className='w-max flex gap-3 mb-8 bg-gray-200 p-1 rounded-full'>
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#15B826] text-white shadow-lg hover:bg-[#15B826]/90"
                    : "bg-[#ffffff71] text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='bg-card border border-border rounded-xl overflow-hidden animate-pulse'
                >
                  <div className='h-48 bg-muted' />
                  <div className='p-6 space-y-3'>
                    <div className='h-5 bg-muted rounded w-3/4' />
                    <div className='h-4 bg-muted rounded w-1/2' />
                    <div className='h-4 bg-muted rounded w-full' />
                    <div className='h-10 bg-muted rounded w-full mt-4' />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className='text-center py-24 text-muted-foreground'>
              No posts found.
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <div
                  key={post._id}
                  className='bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group'
                >
                  {/* Image */}
                  <div className='relative'>
                    <Image
                      width={500}
                      height={500}
                      src={post.image || PLACEHOLDER}
                      alt={post.title}
                      className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    {/* Category badge */}
                    <span className='absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full capitalize'>
                      {post.category}
                    </span>
                    {/* Status badge */}
                    <span
                      className={`absolute top-3 right-3 text-white text-xs px-2 py-1 rounded-full ${
                        statusColour[post.status] ?? "bg-gray-500"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className='p-6'>
                    <h3 className='text-xl font-semibold text-foreground mb-3 line-clamp-1'>
                      {post.title}
                    </h3>

                    {/* Author id (shortened) */}
                    <div className='flex items-center gap-2 mb-4'>
                      <Avatar className='h-6 w-6'>
                        <AvatarFallback className='text-[10px]'>
                          {post.author.slice(-2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-xs text-muted-foreground truncate'>
                        ID: {post.author}
                      </span>
                    </div>

                    <p className='text-sm text-muted-foreground mb-4 line-clamp-2'>
                      {post.description}
                    </p>

                    {/* Stats */}
                    <div className='flex items-center gap-4 mb-4 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Eye className='h-4 w-4 text-[#15B826]' />
                        {formatNumber(post.views)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Bookmark className='h-4 w-4 text-[#15B826]' />
                        {formatNumber(post.totalSaved)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Heart className='h-4 w-4 text-[#15B826]' />
                        {post.likes}
                      </span>
                    </div>

                    {/* Location & date */}
                    <div className='space-y-2 mb-5'>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <MapPin className='h-4 w-4 text-[#15B826] shrink-0' />
                        <span className='truncate'>{post.address || "—"}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4 text-[#15B826] shrink-0' />
                        <span>
                          {post.startDate
                            ? `${formatDate(post.startDate)} · ${formatTime(post.startTime)}`
                            : "Date not set"}
                        </span>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-[#15B826] hover:bg-[#15B826]/90 text-white font-medium cursor-pointer'
                      onClick={() => setSelectedPost(post)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail Modal ── */}
        <Dialog
          open={!!selectedPost}
          onOpenChange={() => setSelectedPost(null)}
        >
          <DialogContent className='max-w-4xl lg:max-w-[1100px] max-h-[90vh] overflow-y-auto bg-card border-border'>
            <DialogHeader className='relative'></DialogHeader>

            {selectedPost && (
              <div className='space-y-6'>
                {/* Hero */}
                <div className='relative rounded-xl overflow-hidden'>
                  <Image
                    width={1100}
                    height={440}
                    src={selectedPost.image || PLACEHOLDER}
                    alt={selectedPost.title}
                    className='w-full h-64 md:h-80 object-cover'
                  />
                  <span className='absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full capitalize'>
                    {selectedPost.category}
                    {selectedPost.subcategory &&
                      ` · ${selectedPost.subcategory}`}
                  </span>
                  <span
                    className={`absolute top-4 right-4 text-white text-xs px-3 py-1 rounded-full ${
                      statusColour[selectedPost.status] ?? "bg-gray-500"
                    }`}
                  >
                    {selectedPost.status}
                  </span>
                </div>

                <div className='grid md:grid-cols-3 gap-8'>
                  {/* Left — main details */}
                  <div className='md:col-span-2 space-y-6'>
                    <div>
                      <h1 className='text-2xl font-bold text-foreground mb-3'>
                        {selectedPost.title}
                      </h1>

                      {/* Author */}
                      <div className='flex items-center gap-2 mb-4'>
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback className='text-xs'>
                            {selectedPost.author.slice(-2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-xs text-muted-foreground'>
                            Author ID
                          </p>
                          <p className='text-sm font-medium text-foreground break-all'>
                            {selectedPost.author}
                          </p>
                        </div>
                      </div>

                      <p className='text-muted-foreground leading-relaxed'>
                        {selectedPost.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {selectedPost.hasTag.some(Boolean) && (
                      <div className='flex flex-wrap gap-2'>
                        {selectedPost.hasTag.filter(Boolean).map((t, i) => (
                          <Badge key={i} variant='secondary' className='gap-1'>
                            <Tag className='h-3 w-3' />
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats row */}
                    <div className='flex items-center gap-6 text-sm'>
                      <span className='flex items-center gap-2'>
                        <Eye className='h-4 w-4 text-[#15B826]' />
                        <span className='font-medium'>
                          {formatNumber(selectedPost.views)} views
                        </span>
                      </span>
                      <span className='flex items-center gap-2'>
                        <Bookmark className='h-4 w-4 text-[#15B826]' />
                        <span className='font-medium'>
                          {formatNumber(selectedPost.totalSaved)} saves
                        </span>
                      </span>
                      <span className='flex items-center gap-2'>
                        <Heart className='h-4 w-4 text-[#15B826]' />
                        <span className='font-medium'>
                          {selectedPost.likes} likes
                        </span>
                      </span>
                    </div>

                    {/* Location / date */}
                    <div className='space-y-3'>
                      <div className='flex items-start gap-3 text-muted-foreground'>
                        <MapPin className='h-5 w-5 text-[#15B826] shrink-0 mt-0.5' />
                        <span>
                          {selectedPost.address || "Address not provided"}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 text-muted-foreground'>
                        <Calendar className='h-5 w-5 text-[#15B826] shrink-0' />
                        {selectedPost.startDate ? (
                          <span>
                            {formatDate(selectedPost.startDate)}
                            {selectedPost.startTime &&
                              ` · ${formatTime(selectedPost.startTime)}`}
                            {selectedPost.endDate &&
                              ` → ${formatDate(selectedPost.endDate)}`}
                          </span>
                        ) : (
                          <span>Date not set</span>
                        )}
                      </div>
                    </div>

                    {/* Weekly schedule (services) */}
                    {selectedPost.schedule.length > 0 && (
                      <div>
                        <h3 className='font-semibold text-foreground mb-3'>
                          Weekly Schedule
                        </h3>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                          {selectedPost.schedule.map((s) => (
                            <div
                              key={s._id}
                              className='bg-secondary/50 rounded-lg px-3 py-2 text-sm'
                            >
                              <span className='font-medium capitalize'>
                                {s.day}
                              </span>
                              <span className='text-muted-foreground ml-2'>
                                {s.startTime} – {s.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Media thumbnails */}
                    {selectedPost.media && selectedPost.media.length > 0 && (
                      <div>
                        <h3 className='font-semibold text-foreground mb-3'>
                          Media
                        </h3>
                        <div className='flex gap-3 flex-wrap'>
                          {selectedPost.media.map((url, i) =>
                            url.endsWith(".mp4") ? (
                              <video
                                key={i}
                                src={url}
                                controls
                                className='h-28 rounded-lg object-cover'
                              />
                            ) : (
                              <Image
                                key={i}
                                src={url}
                                alt={`media-${i}`}
                                width={120}
                                height={112}
                                className='h-28 w-auto rounded-lg object-cover'
                              />
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right — stats card */}
                  <div className='space-y-4'>
                    <div className='bg-secondary/50 rounded-xl p-6 space-y-5'>
                      <h3 className='font-semibold text-foreground'>
                        Post Details
                      </h3>

                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm'>
                          Ticket / Price
                        </span>
                        <span className='text-lg font-bold text-[#15B826]'>
                          {selectedPost.price != null && selectedPost.price > 0
                            ? `$${selectedPost.price}`
                            : "Free"}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm'>
                          Capacity
                        </span>
                        <Badge className='bg-[#15B826] text-white'>
                          {selectedPost.capacity ?? "—"}
                        </Badge>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm'>
                          Attendees
                        </span>
                        <span className='font-semibold text-foreground'>
                          {selectedPost.attenders.length}
                        </span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-muted-foreground text-sm'>
                          Boosted
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            selectedPost.boost
                              ? "text-[#15B826]"
                              : "text-muted-foreground"
                          }`}
                        >
                          {selectedPost.boost ? "Yes" : "No"}
                        </span>
                      </div>

                      {selectedPost.contactInfo && (
                        <div className='flex justify-between items-center'>
                          <span className='text-muted-foreground text-sm'>
                            Contact
                          </span>
                          <span className='text-sm font-medium text-foreground'>
                            {selectedPost.contactInfo}
                          </span>
                        </div>
                      )}

                      {selectedPost.expireLimit != null && (
                        <div className='flex justify-between items-center'>
                          <span className='text-muted-foreground text-sm'>
                            Expires in
                          </span>
                          <span className='text-sm font-medium text-foreground'>
                            {selectedPost.expireLimit} days
                          </span>
                        </div>
                      )}

                      <div className='border-t border-border pt-4 space-y-1 text-xs text-muted-foreground'>
                        <p>
                          Created:{" "}
                          {new Date(selectedPost.createdAt).toLocaleString()}
                        </p>
                        <p>
                          Updated:{" "}
                          {new Date(selectedPost.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {selectedPost.serviceArea && (
                      <div className='bg-secondary/50 rounded-xl p-4'>
                        <p className='text-xs text-muted-foreground mb-1'>
                          Service Area
                        </p>
                        <p className='text-sm font-medium text-foreground'>
                          {selectedPost.serviceArea}
                        </p>
                      </div>
                    )}
                  </div>
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
    </RoleRedirect>
  );
}
