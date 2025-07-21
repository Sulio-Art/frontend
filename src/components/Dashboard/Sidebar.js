// src/components/Dashboard/Sidebar.js

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // useRouter is removed
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "@/lib/api/authApi";
import { logout } from "@/lib/slices/authSlice";
import { Toaster, toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Palette,
  ScrollText,
  MessageSquare,
  CreditCard,
  Users2,
  CalendarDays,
  Settings,
  User,
  LogOut,
  ShieldCheck,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const allSidebarItems = [
  {
    group: "Main",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { title: "Artwork", icon: Palette, href: "/dashboard/artwork" },
      { title: "Diary", icon: ScrollText, href: "/dashboard/diary" },
      { title: "AI Chatbot", icon: MessageSquare, href: "/dashboard/chatbot" },
    ],
  },
  {
    group: "Manage",
    items: [
      { title: "Customers", icon: Users2, href: "/dashboard/customers" },
      { title: "Events", icon: CalendarDays, href: "/dashboard/events" },
      {
        title: "Subscription",
        icon: CreditCard,
        href: "/dashboard/subscription",
      },
      {
        title: "Transactions",
        icon: CreditCard,
        href: "/dashboard/transactions",
      },
    ],
  },
  {
    group: "Admin",
    adminOnly: true,
    items: [
      { title: "User Management", icon: Users2, href: "/admin/users" },
      { title: "App Analytics", icon: BarChart2, href: "/admin/analytics" },
      { title: "System Settings", icon: ShieldCheck, href: "/admin/system" },
    ],
  },
];

const bottomItems = [
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
  { title: "Profile", icon: User, href: "/dashboard/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // FIX: Ensure 'isLoading' is destructured from the mutation hook
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    const logoutPromise = logoutUser().unwrap();

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: "Logout failed. Please try again.",
    });

    try {
      // Wait for backend to confirm logout and delete cookie
      await logoutPromise;

      // Clear the user state in Redux
      dispatch(logout());

      // FIX: Force a full page reload to the login page to avoid middleware race conditions
      window.location.assign("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // As a fallback, still clear Redux and force redirect
      dispatch(logout());
      window.location.assign("/auth/login");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-white">
        <div className="flex items-center gap-2 p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-purple-600">
              AI Artist
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-4 overflow-y-auto">
          {allSidebarItems.map((group) => {
            if (group.adminOnly && !isAdmin) {
              return null;
            }
            return (
              <div key={group.group}>
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.group}
                </h3>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                        isActive && "bg-purple-100 text-purple-700 font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t">
          {bottomItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                  isActive && "bg-purple-100 text-purple-700 font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{item.title}</span>
              </Link>
            );
          })}
          <Separator className="my-2" />
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoading} // This will now work correctly
            className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">
              {isLoading ? "Logging out..." : "Log Out"}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
