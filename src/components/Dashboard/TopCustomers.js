"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useGetCustomersQuery } from "@/lib/api/customerApi";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageSquare } from "lucide-react";

export function TopCustomers() {
  // Step 1: Fetch customer data
  const { data: customers = [], isLoading } = useGetCustomersQuery();

  // Step 2: Add mock stats, sort, and get the top customers
  const topCustomers = useMemo(() => {
    return customers
      .map((customer) => ({
        ...customer,
        // In a real app, this data would come from the backend.
        // We simulate it here for demonstration.
        totalSpent: Math.floor(Math.random() * 2000) + 100,
        purchases: Math.floor(Math.random() * 15) + 1,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent) // Sort by most spent
      .slice(0, 4); // Take the top 4
  }, [customers]);

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <CardTitle className="text-xl font-semibold">Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.length > 0 ? (
            topCustomers.map((customer) => (
              <div
                key={customer._id}
                className="flex items-center space-x-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      customer.avatar ||
                      `https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}&background=random`
                    }
                    alt={`${customer.firstName} ${customer.lastName}`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {`${customer.firstName} ${customer.lastName}`}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    ${customer.totalSpent} · {customer.purchases} purchases
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Message</span>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No customer data available yet.</p>
            </div>
          )}
        </div>

        <Link href="/dashboard/customers">
          <Button
            variant="outline"
            className="w-full mt-4 text-sm text-gray-700"
          >
            View All Customers
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
