"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  X,
  Eye,
  Bookmark,
  Heart,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  stats: {
    views: number;
    saves: number;
    likes: number;
  };
  earnings: string;
  seatsSold: string;
  totalSeats: string;
  ticketPrice: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Night at Casa Verde",
    author: {
      name: "Jacob Jones",
      avatar: "/jacob-jones-profile.jpg",
    },
    description:
      "Join us for the ultimate nightlife experience! Dance, drink, and vibe with top DJs spinning electrifying beats all night long",
    image: "/service.jpg",
    location: "2118 Thornridge Cir",
    date: "21/03/2025",
    time: "09:00pm - 02:00am",
    stats: {
      views: 100,
      saves: 50,
      likes: 23,
    },
    earnings: "$500",
    seatsSold: "68",
    totalSeats: "40",
    ticketPrice: "$50",
  },
  {
    id: "2",
    title: "Night at Casa Verde",
    author: {
      name: "Jacob Jones",
      avatar: "/jacob-jones-profile.jpg",
    },
    description:
      "Join us for the ultimate nightlife experience! Dance, drink, and vibe with top DJs spinning electrifying beats all night long",
    image: "/service.jpg",
    location: "2118 Thornridge Cir",
    date: "21/03/2025",
    time: "09:00pm - 02:00am",
    stats: {
      views: 100,
      saves: 50,
      likes: 23,
    },
    earnings: "$500",
    seatsSold: "68",
    totalSeats: "40",
    ticketPrice: "$50",
  },
  {
    id: "3",
    title: "Night at Casa Verde",
    author: {
      name: "Jacob Jones",
      avatar: "/jacob-jones-profile.jpg",
    },
    description:
      "Join us for the ultimate nightlife experience! Dance, drink, and vibe with top DJs spinning electrifying beats all night long",
    image: "/service.jpg",
    location: "2118 Thornridge Cir",
    date: "21/03/2025",
    time: "09:00pm - 02:00am",
    stats: {
      views: 100,
      saves: 50,
      likes: 23,
    },
    earnings: "$500",
    seatsSold: "68",
    totalSeats: "40",
    ticketPrice: "$50",
  },
];

const tabs = [
  { id: "events", label: "Event's", active: true },
  { id: "deals", label: "Deal's", active: false },
  { id: "services", label: "Service's", active: false },
  { id: "alerts", label: "Alert's", active: false },
];

export default function EventPlatform() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("events");

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return num.toString();
  };

  return (
    <div className='min-h-screen bg-transparent mt-6'>
      {/* Navigation Tabs */}
      <div className='container mx-auto py-6'>
        <div className='w-max flex gap-2 mb-8 bg-gray-200 p-1 rounded-full'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all bg-[#ffffff71] cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#15B826] text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className='bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group'
            >
              <div className='relative'>
                <Image
                  width={500}
                  height={500}
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute bottom-3 left-3 flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='p-6'>
                <h3 className='text-xl font-semibold text-foreground mb-3'>
                  {event.title}
                </h3>

                <div className='flex items-center gap-2 mb-4'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={event.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {event.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm text-muted-foreground'>
                    Post by: {event.author.name}
                  </span>
                </div>

                <p className='text-sm text-muted-foreground mb-4 line-clamp-3'>
                  {event.description}
                </p>

                <div className='flex items-center gap-4 mb-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Eye className='h-4 w-4 text-success' />
                    <span>{formatNumber(event.stats.views)}+</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Bookmark className='h-4 w-4 text-success' />
                    <span>{formatNumber(event.stats.saves)}+</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Heart className='h-4 w-4 text-success' />
                    <span>{event.stats.likes}</span>
                  </div>
                </div>

                <div className='space-y-2 mb-6'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <MapPin className='h-4 w-4 text-success' />
                    <span>{event.location}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4 text-success' />
                    <span>
                      {event.date} | {event.time}
                    </span>
                  </div>
                </div>

                <Button
                  className='w-full bg-[#15B826] hover:bg-success/90 text-white font-medium cursor-pointer'
                  onClick={() => setSelectedEvent(event)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className='max-w-4xl lg:max-w-[1200px] max-h-[90vh] overflow-y-auto bg-card border-border'>
          <DialogHeader className='relative'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute -top-1 -right-1 h-8 w-8 rounded-full bg-success hover:bg-success/90 text-success-foreground'
              onClick={() => setSelectedEvent(null)}
            >
              <X className='h-4 w-4' />
            </Button>
          </DialogHeader>

          {selectedEvent && (
            <div className='space-y-6'>
              {/* Hero Image */}
              <div className='relative rounded-xl overflow-hidden'>
                <Image
                  width={800}
                  height={400}
                  src={selectedEvent.image || "/placeholder.svg"}
                  alt={selectedEvent.title}
                  className='w-full h-64 md:h-80 object-cover'
                />
                <div className='absolute bottom-4 left-4 flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='grid md:grid-cols-3 gap-8'>
                {/* Left Column - Event Details */}
                <div className='md:col-span-2 space-y-6'>
                  <div>
                    <h1 className='text-3xl font-bold text-foreground mb-4'>
                      {selectedEvent.title}
                    </h1>

                    <div className='flex items-center gap-3 mb-6'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={
                            selectedEvent.author.avatar || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {selectedEvent.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-muted-foreground'>
                        Post by:{" "}
                        <span className='text-foreground font-medium'>
                          {selectedEvent.author.name}
                        </span>
                      </span>
                    </div>

                    <p className='text-muted-foreground leading-relaxed mb-6'>
                      {selectedEvent.description}
                    </p>

                    <div className='flex items-center gap-6 text-sm'>
                      <div className='flex items-center gap-2'>
                        <Eye className='h-4 w-4 text-success' />
                        <span className='text-foreground font-medium'>
                          {formatNumber(selectedEvent.stats.views)}+
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Bookmark className='h-4 w-4 text-success' />
                        <span className='text-foreground font-medium'>
                          {formatNumber(selectedEvent.stats.saves)}+
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Heart className='h-4 w-4 text-success' />
                        <span className='text-foreground font-medium'>
                          {selectedEvent.stats.likes}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 text-muted-foreground'>
                      <MapPin className='h-5 w-5 text-success flex-shrink-0' />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className='flex items-center gap-3 text-muted-foreground'>
                      <Calendar className='h-5 w-5 text-success flex-shrink-0' />
                      <span>
                        {selectedEvent.date} | {selectedEvent.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats */}
                <div className='space-y-4'>
                  <div className='bg-secondary/50 rounded-xl p-6 space-y-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground'>
                        Total Earnings
                      </span>
                      <span className='text-2xl font-bold text-success'>
                        {selectedEvent.earnings}
                      </span>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground'>Seat Sold</span>
                      <Badge className='bg-success text-success-foreground'>
                        {selectedEvent.seatsSold}/{selectedEvent.totalSeats}
                      </Badge>
                    </div>

                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground'>
                        Ticket Price
                      </span>
                      <span className='text-xl font-semibold text-success'>
                        {selectedEvent.ticketPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
