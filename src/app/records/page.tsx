"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { CreditCard, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlobalPagination from "@/components/pagination/GlobalPagination";
import Spinner from "@/components/loading/Spinner";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
import {
  useGetRecordsQuery,
  useMarkAsPaidMutation,
} from "@/redux/features/record/recordAPI";

type PayoutStatus = "PENDING" | "COMPLETED";

interface Provider {
  _id: string;
  name: string;
  email: string;
  card: string;
}

interface Payout {
  _id: string;
  provider: Provider;
  card: string;
  amount: number;
  status: PayoutStatus;
  service: string;
  createdAt: string;
  updatedAt: string;
}

const maskCard = (card: string) =>
  card && card.length > 4 ? `•••• •••• •••• ${card.slice(-4)}` : card || "N/A";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const STATUS_CONFIG: Record<
  PayoutStatus,
  { label: string; classes: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  COMPLETED: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400",
  },
};

function StatusBadge({ status }: { status: PayoutStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["PENDING"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className='bg-card border border-border rounded-xl p-4 flex items-center gap-4'>
      <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
      <div>
        <p className='text-sm text-[#666]'>{label}</p>
        <p className='text-xl font-bold text-[#292929]'>{value}</p>
      </div>
    </div>
  );
}

export default function PayoutManagement() {
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [page, setPage] = useState(1);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const LIMIT = 10;

  const {
    data: recordData,
    isLoading,
    refetch,
  } = useGetRecordsQuery({
    page,
    limit: LIMIT,
  });

  const [markAsPaid] = useMarkAsPaidMutation();

  const allPayouts: Payout[] = recordData?.data ?? [];
  const totalPages: number = recordData?.meta?.totalPage ?? 1;
  const pendingCount = recordData?.pending ?? 0;
  const completedCount = recordData?.complete ?? 0;

  const handleMarkAsPaid = async (id: string) => {
    try {
      setMarkingId(id);
      await markAsPaid(id).unwrap();
      refetch();
      // Close dialog if this payout was open
      if (selectedPayout?._id === id) setSelectedPayout(null);
    } catch (err) {
      console.error("Failed to mark as paid:", err);
    } finally {
      setMarkingId(null);
    }
  };

  const openDetail = (payout: Payout) => setSelectedPayout(payout);

  if (isLoading)
    return (
      <div className='p-10 flex justify-center text-primary'>
        <Spinner />
      </div>
    );

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <div className='min-h-screen bg-background !rounded-2xl mt-10'>
        {/* ── Header ── */}
        <header className='backdrop-blur-sm sticky top-0 z-40'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
              <h1 className='text-xl font-semibold text-[#292929]'>
                Payout Records
              </h1>
            </div>
          </div>
        </header>

        <div className='container mx-auto px-4 py-6 space-y-6'>
          {/* ── Stat Cards ── */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <StatCard
              label='Pending'
              value={pendingCount}
              icon={<Clock className='h-5 w-5 text-amber-500' />}
              accent='bg-amber-50'
            />
            <StatCard
              label='Completed'
              value={completedCount}
              icon={<CheckCircle className='h-5 w-5 text-emerald-500' />}
              accent='bg-emerald-50'
            />
          </div>

          {/* ── Table ── */}
          <div className='bg-card border border-border rounded-xl overflow-hidden'>
            {/* Desktop header */}
            <div className='bg-[#17CA2A] hidden md:block'>
              <div className='grid grid-cols-6 gap-4 px-6 py-4'>
                {["SL", "Provider", "Card", "Amount", "Status", "Action"].map(
                  (h) => (
                    <div
                      key={h}
                      className='text-center text-base font-medium text-white'
                    >
                      {h}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className='divide-y divide-border'>
              {allPayouts.length === 0 ? (
                <div className='py-16 text-center text-gray-500'>
                  <CreditCard className='h-10 w-10 mx-auto mb-3 text-gray-300' />
                  <p>No payout records found.</p>
                </div>
              ) : (
                allPayouts.map((payout, index) => (
                  <div
                    key={payout._id}
                    className='hover:bg-secondary/50 transition-colors'
                  >
                    {/* ── Mobile layout ── */}
                    <div className='md:hidden px-4 py-4 space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span className='text-xs font-bold text-[#17CA2A] bg-[#17CA2A]/10 px-2 py-0.5 rounded-full'>
                            #
                            {((page - 1) * LIMIT + index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                          <div>
                            <p className='font-semibold text-[#292929] text-sm'>
                              {payout.provider.name}
                            </p>
                            <p className='text-xs text-[#666]'>
                              {payout.provider.email}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={payout.status} />
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-[#666] font-mono'>
                          {maskCard(payout.provider.card)}
                        </span>
                        <span className='font-bold text-[#292929]'>
                          ${payout.amount}
                        </span>
                      </div>
                      <div className='flex justify-end gap-2'>
                        {payout.status === "PENDING" && (
                          <Button
                            size='sm'
                            disabled={markingId === payout._id}
                            className='text-xs bg-[#17CA2A] hover:bg-[#15B826] text-white'
                            onClick={() => handleMarkAsPaid(payout._id)}
                          >
                            {markingId === payout._id
                              ? "Marking..."
                              : "Mark Paid"}
                          </Button>
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-xs text-[#17CA2A] hover:text-[#15B826] hover:bg-[#17CA2A]/10'
                          onClick={() => openDetail(payout)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    {/* ── Desktop layout ── */}
                    <div className='hidden md:grid grid-cols-6 items-center gap-4 px-6 py-4'>
                      <div className='text-center text-base font-medium text-[#292929]'>
                        {((page - 1) * LIMIT + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                      <div className='text-center'>
                        <p className='text-sm font-medium text-[#292929] truncate'>
                          {payout.provider.name}
                        </p>
                        <p className='text-xs text-[#666] truncate'>
                          {payout.provider.email}
                        </p>
                      </div>
                      <div className='text-center font-mono text-sm text-[#292929]'>
                        {maskCard(payout.provider.card)}
                      </div>
                      <div className='text-center font-bold text-[#292929]'>
                        ${payout.amount}
                      </div>
                      <div className='flex justify-center'>
                        <StatusBadge status={payout.status} />
                      </div>
                      <div className='flex justify-center items-center gap-2'>
                        {payout.status === "PENDING" && (
                          <Button
                            size='sm'
                            disabled={markingId === payout._id}
                            className='text-xs bg-[#17CA2A] hover:bg-[#15B826] text-white px-3'
                            onClick={() => handleMarkAsPaid(payout._id)}
                          >
                            {markingId === payout._id ? "..." : "Mark Paid"}
                          </Button>
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-xs text-[#17CA2A] hover:text-[#15B826] hover:bg-[#17CA2A]/10'
                          onClick={() => openDetail(payout)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Table Pagination ── */}
        {totalPages > 1 && (
          <GlobalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* ── Detail Dialog ── */}
        <Dialog
          open={!!selectedPayout}
          onOpenChange={() => setSelectedPayout(null)}
        >
          <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border'>
            {selectedPayout && (
              <div className='space-y-6'>
                {/* Provider Info */}
                <div className='flex items-center gap-4'>
                  <Avatar className='h-14 w-14 border-2 border-[#17CA2A]'>
                    <AvatarImage src='/user.png' />
                    <AvatarFallback className='bg-gray-200 text-[#292929] text-xl font-bold'>
                      {selectedPayout.provider.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-lg font-bold text-[#292929]'>
                      {selectedPayout.provider.name}
                    </p>
                    <p className='text-sm text-[#666]'>
                      {selectedPayout.provider.email}
                    </p>
                  </div>
                </div>

                {/* Detail Rows */}
                <div className='bg-secondary/30 rounded-xl divide-y divide-border overflow-hidden'>
                  {[
                    { label: "Payout ID", value: selectedPayout._id },
                    {
                      label: "Card",
                      value: maskCard(selectedPayout.provider.card),
                    },
                    { label: "Amount", value: `$${selectedPayout.amount}` },
                    { label: "Service ID", value: selectedPayout.service },
                    {
                      label: "Created",
                      value: `${formatDate(selectedPayout.createdAt)} at ${formatTime(selectedPayout.createdAt)}`,
                    },
                    {
                      label: "Updated",
                      value: `${formatDate(selectedPayout.updatedAt)} at ${formatTime(selectedPayout.updatedAt)}`,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className='flex justify-between px-4 py-3 text-sm'
                    >
                      <span className='text-[#666]'>{label}</span>
                      <span className='font-medium text-[#292929] text-right max-w-[55%] break-all'>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className='flex justify-between items-center px-4 py-3 text-sm'>
                    <span className='text-[#666]'>Status</span>
                    <StatusBadge status={selectedPayout.status} />
                  </div>
                </div>

                {/* Mark as Paid — only when PENDING */}
                {selectedPayout.status === "PENDING" && (
                  <div className='space-y-2'>
                    <p className='text-xs text-[#666] font-medium uppercase tracking-wide'>
                      Action
                    </p>
                    <Button
                      className='w-full bg-[#17CA2A] hover:bg-[#15B826] text-white font-medium'
                      disabled={markingId === selectedPayout._id}
                      onClick={() => handleMarkAsPaid(selectedPayout._id)}
                    >
                      <CheckCircle className='h-4 w-4 mr-2' />
                      {markingId === selectedPayout._id
                        ? "Processing..."
                        : "Mark as Paid"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleRedirect>
  );
}
