// "use client";

// import { GetStartedDialog } from "@/components/Dashboard/GetStartedDialog";
// import { DashboardWelcome } from "@/components/Dashboard/DashboardWelcome";
// import { DashboardStats } from "@/components/Dashboard/DashboardStats";
// import { RecentActivities } from "@/components/Dashboard/RecentActivities";
// import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
// import { ArtworkStats } from "@/components/Dashboard/ArtworkStats";
// import { TopArtworks } from "@/components/Dashboard/TopArtworks";
// import { MonthlySales } from "@/components/Dashboard/MonthlySales";
// import { TopCustomers } from "@/components/Dashboard/TopCustomers";

// export default function DashboardPage() {
//   return (
//     <>
//       <DashboardWelcome />
//       <GetStartedDialog />

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
//         <DashboardStats />
//       </div>

    
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
       
//         <div className="lg:col-span-2 space-y-6">
//           <RecentActivities />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <ArtworkStats />
//             <MonthlySales />
//           </div>
//           <TopArtworks />
//         </div>

        
//         <div className="space-y-6">
//           <UpcomingEvents />
//           <TopCustomers />
//         </div>
//       </div>
//     </>
//   );
// }



// pages/dashboard/index.js






"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Import your components
import { ConnectInstagramModal } from "@/components/ConnectInstagramModal"; // Assuming this exists
import { GetStartedDialog } from "@/components/Dashboard/GetStartedDialog";
import { DashboardWelcome } from "@/components/Dashboard/DashboardWelcome";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { RecentActivities } from "@/components/Dashboard/RecentActivities";
import { UpcomingEvents } from "@/components/Dashboard/UpcomingEvents";
import { ArtworkStats } from "@/components/Dashboard/ArtworkStats";
import { TopArtworks } from "@/components/Dashboard/TopArtworks";
import { MonthlySales } from "@/components/Dashboard/MonthlySales";
import { TopCustomers } from "@/components/Dashboard/TopCustomers";

export default function DashboardGatekeeperPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }

    if (session) {
      // 1. Role-Based Redirection
      console.log(session.user, 'tdrftyguhijo')
      if (session.user.role === 'superadmin') {
        router.replace('/superAdmin');
        return;
      }

      // 2. Instagram Connection Check (for 'user' role)
      const hasSkipped = sessionStorage.getItem('skippedInstagramConnect');
      if (!session.user.isInstagramConnected && !hasSkipped) {
        setShowModal(true);
      }
    }
  }, [status, session, router]);

  const handleSkip = () => {
    sessionStorage.setItem('skippedInstagramConnect', 'true');
    setShowModal(false);
  };

  // Show a full-page loader while checking session or redirecting
  if (status === "loading" || !session || session?.user.role === 'superadmin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  // Render the 'user' role dashboard
  return (
    <>
      <ConnectInstagramModal open={showModal} onSkip={handleSkip} />
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