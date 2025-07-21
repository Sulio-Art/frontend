

"use client";

import { useState, useMemo } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "@/lib/api/eventApi";
import { format, isPast } from "date-fns";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Edit,
  Trash2,
  Share2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default function EventsPage() {
  const { data: rawEvents = [], isLoading, error } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const events = useMemo(
    () =>
      rawEvents.map((event) => ({
        ...event,
        status: isPast(new Date(event.date)) ? "Completed" : "Upcoming",
        attendees: event.participants?.length || 0,
        image: event.imageUrl || "/images/event-placeholder.jpg",
        time: new Date(event.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: event.type || "General",
      })),
    [rawEvents]
  );

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        if (activeTab !== "all" && event.status.toLowerCase() !== activeTab)
          return false;
        if (
          searchQuery &&
          !event.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      }),
    [events, activeTab, searchQuery]
  );

  const stats = useMemo(
    () => ({
      totalEvents: events.length,
      upcomingEvents: events.filter((e) => e.status === "Upcoming").length,
      completedEvents: events.filter((e) => e.status === "Completed").length,
      totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
    }),
    [events]
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteEvent(id).unwrap();
        toast.success("Event deleted.");
      } catch (err) {
        toast.error("Failed to delete event.");
      }
    }
  };

 
  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">Error loading events.</div>;

 
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Event Management</h1>
          <p className="text-gray-600 mt-1">
            Organize your workshops and exhibitions
          </p>
        </div>
        <Link href="/dashboard/events/add">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* ... Stats Cards ... */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Events</p>
            <h3 className="text-2xl font-semibold">{stats.totalEvents}</h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Upcoming</p>
            <h3 className="text-2xl font-semibold text-purple-600">
              {stats.upcomingEvents}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Completed</p>
            <h3 className="text-2xl font-semibold text-green-600">
              {stats.completedEvents}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Attendees</p>
            <h3 className="text-2xl font-semibold text-blue-600">
              {stats.totalAttendees}
            </h3>
          </CardContent>
        </Card>
      </div>
      <Card className="border-none shadow-sm mb-6">
       
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> More Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm overflow-hidden">
        {/* ... Events Grid ... */}
        <CardHeader className="pb-0 border-b">
          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event._id} className="overflow-hidden border">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white/80 rounded-full"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(event._id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === "Upcoming" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        {event.type}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {event.attendees} Participants
                      </div>
                    </div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
                        {format(new Date(event.date), "MMM d, yyyy")} ·{" "}
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="px-4 py-3 border-t flex justify-end">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No events found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
