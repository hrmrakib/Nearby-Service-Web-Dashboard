"use client";

import { useState } from "react";
import { Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  perchesDate: string;
  endDate: string;
  amount: number;
}

const mockSubscribers: Subscriber[] = Array.from({ length: 100 }, (_, i) => ({
  id: `#BI0000${i + 1}`,
  name: "Hazel Janis",
  email: "janis202@gmail.com",
  perchesDate: "4-25-2025",
  endDate: "4-25-2025",
  amount: 200.0,
}));

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Subscriber | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Filter subscribers based on search term
  const filteredSubscribers = mockSubscribers.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handleInfoClick = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsInfoModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className=''>
        {/* Header */}
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-2.5'>
          <h1 className='text-2xl font-bold text-gray-900'>Subscriber</h1>
          <div className='relative w-full sm:w-80'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Search'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='pl-10'
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className='hidden overflow-hidden rounded-lg bg-white shadow-sm md:block'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-table-header-bg text-white'>
                <tr>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    SL no.
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    Subscriber Name
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    Perches Date
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    End Date
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    Amount
                  </th>
                  <th className='px-6 py-4 text-left text-base text-table-header-color font-medium'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {currentSubscribers.map((subscriber, index) => (
                  <tr
                    key={`${subscriber.id}-${index}`}
                    className='hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 text-base text-gray-900'>
                      {subscriber.id}
                    </td>
                    <td className='px-6 py-4 text-base text-gray-900'>
                      {subscriber.name}
                    </td>
                    <td className='px-6 py-4 text-base text-gray-900'>
                      {subscriber.email}
                    </td>
                    <td className='px-6 py-4 text-base text-gray-900'>
                      {subscriber.perchesDate}
                    </td>
                    <td className='px-6 py-4 text-base text-gray-900'>
                      {subscriber.endDate}
                    </td>
                    <td className='px-6 py-4 text-base text-gray-900'>
                      ${subscriber.amount.toFixed(1)}
                    </td>
                    <td className='px-6 py-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleInfoClick(subscriber)}
                        className='h-8 w-8 p-0'
                      >
                        <Info className='h-4 w-4 text-gray-600' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className='space-y-4 md:hidden'>
          {currentSubscribers.map((subscriber, index) => (
            <div
              key={`${subscriber.id}-${index}`}
              className='rounded-lg bg-white p-4 shadow-sm'
            >
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-900'>
                  {subscriber.id}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleInfoClick(subscriber)}
                  className='h-8 w-8 p-0'
                >
                  <Info className='h-4 w-4 text-gray-600' />
                </Button>
              </div>
              <div className='space-y-2'>
                <div>
                  <span className='text-xs font-medium text-gray-500'>
                    Name:
                  </span>
                  <p className='text-sm text-gray-900'>{subscriber.name}</p>
                </div>
                <div>
                  <span className='text-xs font-medium text-gray-500'>
                    Email:
                  </span>
                  <p className='text-sm text-gray-900'>{subscriber.email}</p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      Perches Date:
                    </span>
                    <p className='text-sm text-gray-900'>
                      {subscriber.perchesDate}
                    </p>
                  </div>
                  <div>
                    <span className='text-xs font-medium text-gray-500'>
                      End Date:
                    </span>
                    <p className='text-sm text-gray-900'>
                      {subscriber.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <span className='text-xs font-medium text-gray-500'>
                    Amount:
                  </span>
                  <p className='text-sm text-gray-900'>
                    ${subscriber.amount.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-6 flex items-center justify-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='h-8 w-8 p-0'
            >
              {"<"}
            </Button>

            {getPageNumbers().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <span className='px-2 text-sm text-gray-500'>...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size='sm'
                    onClick={() => handlePageChange(page as number)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === page
                        ? "bg-orange-400 text-white hover:bg-orange-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant='ghost'
              size='sm'
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className='h-8 w-8 p-0'
            >
              {">"}
            </Button>
          </div>
        )}

        {/* Subscriber Info Modal */}
        <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-center text-gray-900 text-xl font-semibold'>
                Subscriber Info
              </DialogTitle>
            </DialogHeader>

            {selectedSubscriber && (
              <div className='space-y-4 py-4'>
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>SL no:</span>
                  <span className='text-gray-600'>{selectedSubscriber.id}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>User Name:</span>
                  <span className='text-gray-600'>
                    {selectedSubscriber.name}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>
                    Email Address:
                  </span>
                  <span className='text-gray-600'>
                    {selectedSubscriber.email}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>
                    Perches Date:
                  </span>
                  <span className='text-gray-600'>
                    {selectedSubscriber.perchesDate}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>End Date:</span>
                  <span className='text-gray-600'>
                    {selectedSubscriber.endDate}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='font-medium text-gray-900'>Amount</span>
                  <span className='text-gray-600'>
                    ${selectedSubscriber.amount.toFixed(1)}
                  </span>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
