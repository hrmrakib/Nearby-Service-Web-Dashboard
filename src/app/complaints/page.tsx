/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Info,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  useGetReportsQuery,
  useRemoveReportedPostMutation,
} from "@/redux/features/report/reportAPI";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import { toast } from "sonner";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

// Updated interface to better reflect the UI needs while mapping from API
interface Report {
  id: string;
  title: string;
  reportedBy: string;
  description: string;
  reportFrom: string;
  reportDate: string;
  email: string;
  image: string;
  distance: string;
  rating: number;
  fullDescription: string;
  postId?: string; // Reference to actual post if needed for actions
}

export default function ReportDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [page, setPage] = useState(1);
  // Fetch real data
  const { data: apiResponse, isLoading } = useGetReportsQuery({
    page,
    limit: 9,
  });
  const [removeReportedPostMutation, { isLoading: isRemovingReportPost }] =
    useRemoveReportedPostMutation();
  const rawReports = apiResponse?.data || [];
  const totalPages = apiResponse?.meta?.totalPage || 1;

  // Filter and Search logic on real data
  const filteredReports = rawReports.filter((report: any) => {
    const title = report.postId?.title || "General Report";
    const reporter = report.userId?.name || "Unknown";
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporter.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleReportClick = (report: any) => {
    // Mapping API fields to the Report Interface for the UI
    const mappedReport: Report = {
      id: report._id,
      title: report.postId?.title || "Account/General Report",
      reportedBy: report.userId?.name || "Anonymous",
      description: report.description,
      reportFrom: report.userId?.name || "N/A",
      reportDate: new Date(report.createdAt)
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", " |"),
      email: report.userId?.email || "No email provided",
      image: report.postId?.image || "/placeholder.svg",
      distance: "Local Area", // If coordinates are needed, map from report.postId.location
      rating: report.postId?.likes || 0,
      fullDescription: report.description,
      postId: report.postId?._id,
    };
    setSelectedReport(mappedReport);
  };

  // Step 1: Open warning modal instead of direct delete
  const handleInitiateRemove = () => {
    if (!selectedReport?.postId) {
      toast.error("Reported post not found");
      return;
    }
    setShowWarning(true);
  };

  // Step 2: Final delete logic
  const handleFinalDelete = async () => {
    if (!selectedReport) return;

    try {
      await removeReportedPostMutation(selectedReport?.postId).unwrap();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setShowWarning(false);
      setSelectedReport(null);
    }
  };

  const handleViewPost = () => {
    if (!selectedReport?.postId) {
      toast.error("Reported post not found");
      return;
    }
    if (selectedReport?.postId) {
      window.open(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/event/${selectedReport?.postId}`,
        "_blank",
      );
      setSelectedReport(null);
    }
  };

  if (isLoading)
    return (
      <div className='p-10 text-center text-primary'>Loading reports...</div>
    );

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='min-h-screen bg-background mt-8 rounded-2xl'>
        <div className='container mx-auto px-4 py-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-foreground'>
                Recent Reports
              </h2>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  placeholder='Search'
                  className='pl-10 w-64 bg-input border-border'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl overflow-hidden'>
              {/* Table Header */}
              <div className='bg-[#17CA2A] text-success-foreground'>
                <div className='grid grid-cols-12 gap-4 px-6 py-4 font-medium'>
                  <div className='col-span-1 text-white text-xl font-semibold'>
                    SL
                  </div>
                  <div className='col-span-5 text-white text-xl font-semibold'>
                    Report
                  </div>
                  <div className='col-span-5 text-white text-xl font-semibold'>
                    Reported by
                  </div>
                  <div className='col-span-1 text-white text-xl font-semibold'>
                    Info
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className='divide-y divide-border'>
                {filteredReports.map((report: any, index: number) => (
                  <div
                    key={report._id}
                    className='grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors items-center'
                  >
                    <div className='col-span-1 text-[#292929] font-medium'>
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <div className='col-span-5 text-[#292929] font-medium truncate'>
                      {report.postId?.title || "No Title"}
                    </div>
                    <div className='col-span-5 text-[#292929] font-medium'>
                      {report.userId?.name || "N/A"}
                    </div>
                    <div className='col-span-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => handleReportClick(report)}
                      >
                        <Info className='h-4 w-4 text-[#292929] hover:text-[#17CA2A]' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Details Modal */}
        <Dialog
          open={!!selectedReport}
          onOpenChange={() => setSelectedReport(null)}
        >
          <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border'>
            <DialogHeader className='relative'>
              <h2 className='text-xl font-semibold text-foreground'>
                Report Details
              </h2>
            </DialogHeader>

            {selectedReport && (
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div className='relative rounded-xl overflow-hidden'>
                    <Image
                      width={800}
                      height={400}
                      src={selectedReport.image || "/placeholder.svg"}
                      alt='Report context'
                      className='w-full h-64 object-cover'
                    />
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-xl font-semibold text-foreground'>
                      {selectedReport.title}
                    </h3>
                    <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <MapPin className='h-5 w-5 text-[#15B826]' />
                        <span className='text-[#374151] font-medium'>
                          {selectedReport.distance}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Star className='h-5 w-5 text-[#15B826] fill-[#15B826]' />
                        <span className='text-[#374151] font-medium'>
                          {selectedReport.rating} Likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='border rounded-lg p-4 bg-secondary/10'>
                    <p className='text-[#4B5563] text-base'>
                      {selectedReport.description}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-[#1F2937] font-bold'>
                        Report From:{" "}
                      </span>
                      <span className='text-[#1F2937]'>
                        {selectedReport.reportFrom}
                      </span>
                    </div>
                    <div>
                      <span className='text-[#1F2937] font-bold'>
                        Report Date:{" "}
                      </span>
                      <span className='text-[#1F2937]'>
                        {selectedReport.reportDate}
                      </span>
                    </div>
                    <div className='md:col-span-2'>
                      <span className='text-[#1F2937] font-bold'>Email: </span>
                      <span className='text-[#1F2937]'>
                        {selectedReport.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-[#1F2937]'>
                    Detailed Report Description
                  </label>
                  <Textarea
                    value={selectedReport.fullDescription}
                    readOnly
                    className='min-h-32 bg-secondary/30 border-border resize-none text-[#4B5563]'
                  />
                </div>

                <div className='flex gap-4 pt-4'>
                  <Button
                    variant='outline'
                    className='flex-1 border-[#EF4444]! text-[#EF4444] hover:bg-[#EF4444]! hover:text-white rounded-full'
                    onClick={handleInitiateRemove}
                  >
                    Remove Post
                  </Button>
                  <Button
                    className='flex-1 bg-[#17CA2A] text-white hover:bg-[#15B826] rounded-full'
                    onClick={handleViewPost}
                  >
                    View Post
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Warning/Confirmation Modal */}
        <Dialog open={showWarning} onOpenChange={setShowWarning}>
          <DialogContent className='max-w-md bg-white border-none shadow-2xl rounded-2xl p-8'>
            <div className='flex flex-col items-center text-center space-y-4'>
              <div className='bg-red-50 p-4 rounded-full'>
                <AlertTriangle className='h-12 w-12 text-[#EF4444]' />
              </div>

              <div className='space-y-2'>
                <h2 className='text-2xl font-bold text-[#1F2937]'>
                  Are you sure?
                </h2>
                <p className='text-[#6B7280]'>
                  This action will permanently delete the post
                  <span className='font-semibold block text-[#1F2937]'>
                    &quot;{selectedReport?.title}&quot;
                  </span>
                  This cannot be undone.
                </p>
              </div>

              <div className='flex w-full gap-3 mt-6'>
                <Button
                  variant='outline'
                  className='flex-1 rounded-full border-gray-200! text-gray-600 hover:bg-gray-50'
                  onClick={() => setShowWarning(false)}
                >
                  Cancel
                </Button>
                <Button
                  disabled={isRemovingReportPost}
                  className='flex-1 rounded-full bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-md shadow-red-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleFinalDelete}
                >
                  Confirm Delete{" "}
                  {isRemovingReportPost && (
                    <Loader size={16} className='animate-spin' />
                  )}
                </Button>
              </div>
            </div>
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
