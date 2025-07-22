"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Using your shadcn/ui Button
import { LogOut } from "lucide-react"; // Optional: for a nice icon

export default function LogoutButton() {
  
  const handleSignOut = () => {
    // Calling signOut from next-auth/react will clear the session
    // and redirect the user.
    signOut({
      // We can specify a callbackUrl to redirect the user to a specific page
      // after they sign out. By default, it will redirect to the home page.
      callbackUrl: "/", 
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}