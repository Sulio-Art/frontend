"use client";

import { useMemo } from "react";
import { useGetAllEventsQuery } from "@/lib/api/eventApi";
import { useSelector } from "react-redux";
import { format, isFuture } from "date-fns";

// UI Components
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Clock, Edit } from "lucide-react";
import Link from "next/link";

const eventTypeColors = {
  Exhibition: "bg-purple-100 text-purple-600",
  Workshop: "bg-green-100 text-green-600",
  Meeting: "bg-blue-100 text-blue-600",
  Opening: "bg-yellow-100 text-yellow-600",
  default: "bg-gray-100 text-gray-600",
};

export function UpcomingEvents() {
  // Step 1: Fetch all events data
  const { data: allEvents = [], isLoading } = useGetAllEventsQuery();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // Step 2: Filter for upcoming events and sort them
  const upcomingEvents = useMemo(() => {
    return allEvents
      .filter((event) => isFuture(new Date(event.date))) // Keep only future events
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by soonest first
      .slice(0, 4); // Show the next 4 upcoming events
  }, [allEvents]);

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="space-y-2 border-b border-gray-100 pb-4 animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => {
              const eventDate = new Date(event.date);
              const eventType = event.type || "Event";
              const badgeClass =
                eventTypeColors[eventType] || eventTypeColors.default;

              return (
                <div
                  key={event._id}
                  className="flex flex-col space-y-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <Badge
                      variant="outline"
                      className={`${badgeClass} border-none`}
                    >
                      {eventType}
                    </Badge>
                    {isAdmin && (
                      <Link href={`/admin/events/edit/${event._id}`}>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-1.5 text-gray-400" />
                      {format(eventDate, "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                      {format(eventDate, "p")}{" "}
                      {/* 'p' formats to 'h:mm AM/PM' */}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
