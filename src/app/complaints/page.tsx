"use client";

import { useState } from "react";
import { Search, X, MapPin, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

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
}

const mockReports: Report[] = [
  {
    id: "01",
    title: "Damaged product",
    reportedBy: "Justin",
    description: "Product arrived damaged and unusable",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "02",
    title: "Hidden fees",
    reportedBy: "Paityn",
    description: "Additional charges not disclosed upfront",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "03",
    title: "Fake reviews",
    reportedBy: "Paityn",
    description: "Suspicious review patterns detected",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "04",
    title: "Poor quality",
    reportedBy: "Jordyn",
    description: "Service quality below expectations",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "05",
    title: "Misleading description",
    reportedBy: "Aspen",
    description: "Event details don't match reality",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "06",
    title: "Price too high",
    reportedBy: "Emerson",
    description: "Overpriced compared to similar services",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    id: "07",
    title: "Outdated information",
    reportedBy: "Chance",
    description: "Information provided is no longer accurate",
    reportFrom: "Cathrine Karen",
    reportDate: "21/03/2025 | 09:00pm",
    email: "example@gmail.com",
    image: "/report.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    fullDescription:
      "Misleading description about the event DJ Party. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
];

export default function ReportDashboard() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = mockReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleRemovePost = () => {
    console.log("[v0] Remove post action triggered");
    setSelectedReport(null);
  };

  const handleViewPost = () => {
    console.log("[v0] View post action triggered");
    setSelectedReport(null);
  };

  return (
    <div className='min-h-screen bg-background mt-8 rounded-2xl'>
      {/* Dashboard Stats */}
      <div className='container mx-auto px-4 py-6'>
        {/* Reports Section */}
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
                <div className='col-span-1 text-table-header-color text-xl font-semibold'>
                  SL
                </div>
                <div className='col-span-5 text-table-header-color text-xl font-semibold'>
                  Report
                </div>
                <div className='col-span-5 text-table-header-color text-xl font-semibold'>
                  Reported by
                </div>
                <div className='col-span-1 text-table-header-color text-xl font-semibold'>
                  Info
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className='divide-y divide-border'>
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className='grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors'
                >
                  <div className='col-span-1 text-[#292929] font-medium'>
                    {report.id}
                  </div>
                  <div className='col-span-5 text-[#292929] font-medium'>
                    {report.title}
                  </div>
                  <div className='col-span-5 text-[#292929] font-medium'>
                    {report.reportedBy}
                  </div>
                  <div className='col-span-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      onClick={() => handleReportClick(report)}
                    >
                      <Info className='h-3 w-3 text-[#292929] hover:text-[#17CA2A]' />
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
            <Button
              variant='ghost'
              size='icon'
              className='absolute -top-2 -right-2 h-8 w-8 rounded-full bg-success hover:bg-success/90 text-success-foreground'
              onClick={() => setSelectedReport(null)}
            >
              <X className='h-4 w-4' />
            </Button>
          </DialogHeader>

          {selectedReport && (
            <div className='space-y-6'>
              {/* Event Image and Title */}
              <div className='space-y-4'>
                <div className='relative rounded-xl overflow-hidden'>
                  <Image
                    width={800}
                    height={400}
                    src={selectedReport.image || "/placeholder.svg"}
                    alt='Live Jazz Night'
                    className='w-full h-56 object-cover'
                  />
                </div>

                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold text-foreground'>
                    Live Jazz Night
                  </h3>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <MapPin className='h-5 w-5 text-[#15B826]' />
                      <span className='text-[#374151] font-medium'>
                        {selectedReport.distance}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Star className='h-5 w-5 text-[#15B826] fill-warning' />
                      <span className='text-[#374151] font-medium'>
                        {selectedReport.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Information */}
              <div className='space-y-4'>
                <div className='border rounded-lg p-2.5'>
                  <p className='text-[#4B5563] text-base'>
                    Misleading description about the event DJ Party
                  </p>
                </div>

                <div className='flex flex-col gap-4 text-sm'>
                  <div>
                    <span className='text-[#1F2937] font-medium'>
                      Report From:{" "}
                    </span>
                    <span className='text-[#1F2937] font-medium'>
                      {selectedReport.reportFrom}
                    </span>
                  </div>
                  <div>
                    <span className='text-[#1F2937] font-medium'>
                      Report Date:{" "}
                    </span>
                    <span className='text-[#1F2937]'>
                      {selectedReport.reportDate}
                    </span>
                  </div>
                </div>

                <div className='text-base'>
                  <span className='text-[#1F2937] font-medium'>Email: </span>
                  <span className='text-[#1F2937] font-medium'>
                    {selectedReport.email}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className='space-y-2'>
                <Textarea
                  value={selectedReport.fullDescription}
                  readOnly
                  className='min-h-32 bg-secondary/30 border-border resize-none text-[#4B5563] placeholder:text-[#4B5563]'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 pt-4'>
                <Button
                  variant='outline'
                  className='flex-1 !border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-[#EF4444] bg-transparent rounded-full cursor-pointer'
                  onClick={handleRemovePost}
                >
                  Remove Post
                </Button>
                <Button
                  className='flex-1 bg-[#17CA2A] !text-white hover:bg-[#17CA2A]/90 rounded-full cursor-pointer'
                  onClick={handleViewPost}
                >
                  View Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
