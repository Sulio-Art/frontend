// src/components/Dashboard/DashboardStats.js

"use client";

import { useMemo } from "react";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi";
import { useSelector } from "react-redux";
import { useGetCustomersQuery } from "@/lib/api/customerApi";

// UI Components
import {
  Palette,
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardStats() {
  // Get the token from the Redux store
  const { token } = useSelector((state) => state.auth);

  const { data: artworks = [], isLoading: isLoadingArtworks } =
    useGetAllArtworksQuery();

  // FIX: Add the 'skip' option to this query hook.
  // This tells the query to wait until the `token` exists before running.
  const { data: customersResponse, isLoading: isLoadingCustomers } =
    useGetCustomersQuery(undefined, {
      skip: !token, // If there is no token, skip the query.
    });

  // Since the response from getCustomers is now the full user object array, access it directly
  // Move customers initialization inside useMemo to avoid dependency issues

  const statCards = useMemo(() => {
    const customers = customersResponse || [];
    // ... (rest of the useMemo hook is the same)
    const totalArtworks = {
      title: "Total Artworks",
      value: artworks.length,
      change: "+5",
      changeType: "positive",
      icon: Palette,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    };
    const newCustomers = {
      title: "Total Customers",
      value: customers.length,
      change: "+2",
      changeType: "positive",
      icon: Users,
      color: "bg-green-100",
      iconColor: "text-green-600",
    };
    const totalSales = {
      title: "Total Sales",
      value: "$0",
      change: "N/A",
      changeType: "positive",
      icon: CreditCard,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    };
    const commission = {
      title: "Commission",
      value: "$0",
      change: "N/A",
      changeType: "negative",
      icon: DollarSign,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    };
    return [totalArtworks, totalSales, newCustomers, commission];
  }, [artworks, customersResponse]);

  const isLoading = isLoadingArtworks || (isLoadingCustomers && !token);

  // ... (rest of the component is the same)
  if (isLoading) {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ));
  }

  return (
    <>
      {statCards.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center gap-1.5">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
