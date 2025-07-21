"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi";

// 1. Import DialogDescription from the UI library
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, MessageSquare, CheckCircle2 } from "lucide-react";

export function GetStartedDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { data: allArtworks = [], isLoading: isLoadingArtworks } =
    useGetAllArtworksQuery();

  const hasUploadedArtwork = allArtworks.some(
    (art) => art.createdBy._id === user?.id
  );
  const hasSetupChatbot = false;

  const steps = [
    {
      id: "artwork",
      title: "Upload your first artwork",
      isCompleted: hasUploadedArtwork,
      href: "/dashboard/artwork/add",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "chatbot",
      title: "Setup your chatbot",
      isCompleted: hasSetupChatbot,
      href: "/dashboard/chatbot",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || isLoadingArtworks) return;
    const hasBeenClosed = sessionStorage.getItem("getStartedDialogClosed");
    if (hasBeenClosed) return;

    const allStepsCompleted = steps.every((step) => step.isCompleted);
    if (!allStepsCompleted) {
      setIsOpen(true);
    }
  }, [steps, isLoadingArtworks]);

  const handleClose = () => {
    sessionStorage.setItem("getStartedDialogClosed", "true");
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 gap-0">
        {/* 2. Add the required DialogTitle and DialogDescription components */}
        {/* We can use the `sr-only` class from Tailwind to hide them visually but keep them for screen readers */}
        <DialogTitle className="sr-only">Getting Started</DialogTitle>
        <DialogDescription className="sr-only">
          A list of steps to complete to get your account set up.
        </DialogDescription>

        <div className="p-6 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome! Let's get you started.
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete these steps to unlock the full potential of your dashboard.
          </p>
        </div>

        <div className="p-6 pt-2 grid gap-4">
          {steps.map((step) => (
            <Card
              key={step.id}
              className={`border-none shadow-sm transition-opacity ${step.isCompleted ? "opacity-60" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className={`rounded-full p-3 ${step.bgColor}`}>
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  {step.isCompleted ? (
                    <div className="flex items-center text-green-600 font-medium text-sm">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Completed
                    </div>
                  ) : (
                    <Link href={step.href}>
                      <Button
                        variant="outline"
                        className="text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Start
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
