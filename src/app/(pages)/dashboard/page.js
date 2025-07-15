

"use client";

import { GetStartedDialog } from "@/components/Dashboard/GetStartedDialog";
import { DashboardWelcome } from "@/components/Dashboard/DashboardWelcome";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
import { ArtworkStats } from "@/components/Dashboard/ArtworkStats";
import { TopArtworks } from "@/components/Dashboard/TopArtworks";
import { MonthlySales } from "@/components/Dashboard/MonthlySales";
import { TopCustomers } from "@/components/Dashboard/TopCustomers";

export default function DashboardPage() {
  return (
    <>
      <DashboardWelcome />
      <GetStartedDialog />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStats />
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
       
        <div className="lg:col-span-2 space-y-6">
          <RecentActivities />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArtworkStats />
            <MonthlySales />
          </div>
          <TopArtworks />
        </div>

        
        <div className="space-y-6">
          <UpcomingEvents />
          <TopCustomers />
        </div>
      </div>
    </>
  );
}
