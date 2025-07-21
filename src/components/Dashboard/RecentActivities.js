"use client";

import { useMemo } from "react";
import { useGetCustomersQuery } from "@/lib/api/customerApi";
import { useGetAllEventsQuery } from "@/lib/api/eventApi";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi"; // Import the hook
import { formatDistanceToNow } from "date-fns";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  MessageSquare,
  Heart,
  CalendarClock,
  DollarSign,
  User as UserIcon,
  Palette, // Import the Palette icon for artwork
} from "lucide-react";

export function RecentActivities() {
  // Fetch data from all relevant sources
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useGetCustomersQuery();
  const { data: events = [], isLoading: isLoadingEvents } =
    useGetAllEventsQuery();
  const { data: artworks = [], isLoading: isLoadingArtworks } =
    useGetAllArtworksQuery();

  // Generate and combine activities in a useMemo hook
  const sortedActivities = useMemo(() => {
    const activities = [];

    // Generate "New Customer" activities
    customers.forEach((customer) => {
      activities.push({
        id: `customer-${customer._id}`,
        type: "customer",
        title: "New Customer Joined",
        description: `${customer.firstName} ${customer.lastName} created an account.`,
        date: new Date(customer.createdAt),
        icon: UserIcon,
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
      });
    });

    // Generate "Upcoming Event" activities
    events.forEach((event) => {
      if (new Date(event.date) > new Date()) {
        activities.push({
          id: `event-${event._id}`,
          type: "event",
          title: "Upcoming Event",
          description: `Your event "${event.title}" is scheduled for ${new Date(event.date).toLocaleDateString()}.`,
          date: new Date(event.date),
          icon: CalendarClock,
          iconColor: "text-purple-600",
          iconBg: "bg-purple-100",
        });
      }
    });

    // Generate "New Artwork" activities
    artworks.forEach((artwork) => {
      activities.push({
        id: `artwork-${artwork._id}`,
        type: "artwork",
        title: "New Artwork Added",
        description: `You added "${artwork.title}" to your portfolio.`,
        date: new Date(artwork.createdAt),
        icon: Palette,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
      });
    });

    // Sort all activities chronologically, newest first
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [customers, events, artworks]); // Add artworks to dependency array

  const isLoading = isLoadingCustomers || isLoadingEvents || isLoadingArtworks;

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="bg-gray-200 p-2 rounded-full mt-0.5 h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {sortedActivities.length > 0 ? (
            sortedActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`${activity.iconBg} p-2 rounded-full mt-0.5`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(activity.date, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activities to show.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
