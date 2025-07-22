// components/ConnectInstagramModal.js
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function ConnectInstagramModal({ open, onSkip }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // This will trigger the NextAuth.js flow to link the account
    signIn("instagram");
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Your Instagram</DialogTitle>
          <DialogDescription>
            To get the full experience, please connect your Instagram account.
            This allows us to tailor content for you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onSkip}>
            Skip for Now
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect Instagram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}