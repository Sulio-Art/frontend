"use client";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "@/lib/api/authApi";
import { logout } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();

      dispatch(logout());

      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);

      dispatch(logout());
      router.push("/auth/login");
    }
  };

  return (
    <div className="relative top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 bg-black text-white">
      <div className="flex-1">
        <Link href="/">
          <Button
            className="hover:bg-transparent bg-black text-lg md:text-xl text-left h-auto text-white"
            style={{ lineHeight: "1.1rem" }}
          >
            <Image
              alt="Sulio Art Logo"
              src="/images/logo.png"
              height={100}
              width={100}
              quality={100}
              priority
              className="h-full w-12 md:w-20 object-cover"
            />
            <div className="flex flex-col items-start">
              <span>Sulio Art</span>
              <span>Artist AI ChatBot</span>
            </div>
          </Button>
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      user?.profile?.profilePicture ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt={user?.firstName || "User"}
                  />

                  <AvatarFallback>
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <Link href="/dashboard/profile">
                <DropdownMenuItem>
                  Profile
                  <Badge variant="secondary" className="ml-2">
                    New
                  </Badge>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/settings">
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-500 focus:text-red-500"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="hidden md:block">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-md text-sm font-medium bg-[#ff8c43] hover:bg-[#ff8c43]/90"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
