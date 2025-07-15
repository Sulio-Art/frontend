// src/app/(pages)/dashboard/settings/page.js

"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// RTK Query Hooks
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/lib/api/settingsApi";
// import { useUpdatePasswordMutation } from "@/lib/api/authApi";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Lock, Bell, CreditCard, Palette, Save } from "lucide-react";

// Validation schema for the password form
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
});

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { data: settingsData, isLoading: isLoadingSettings } =
    useGetSettingsQuery(undefined, {
      skip: !user, // Skip query until user is loaded
    });

  const [updateSettings, { isLoading: isUpdatingSettings }] =
    useUpdateSettingsMutation();
  // const [updatePassword, { isLoading: isUpdatingPassword }] =
  //   useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    // Set default values to prevent uncontrolled-to-controlled errors
    defaultValues: {
      fullName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      notificationsEnabled: true,
      theme: "light",
    },
  });

  // This effect runs when the user or settings data is loaded/changed,
  // and it populates the form with the correct data.
  useEffect(() => {
    if (user) {
      reset({
        fullName: `${user.firstName || ""} ${user.lastName || ""}`,
        email: user.email || "",
        notificationsEnabled: settingsData?.notificationsEnabled ?? true,
        theme: settingsData?.theme || "light",
      });
    }
  }, [user, settingsData, reset]);

  const onSaveSecurity = async (data) => {
    const toastId = toast.loading("Updating password...");
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password updated successfully!", { id: toastId });
      // Reset only the password fields
      reset((currentValues) => ({
        ...currentValues,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err.data?.message || "Failed to update password.", {
        id: toastId,
      });
    }
  };

  const onSaveNotifications = async (data) => {
    try {
      await updateSettings({
        notificationsEnabled: data.notificationsEnabled,
      }).unwrap();
      toast.success("Notification settings saved!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to save settings.");
    }
  };

  const onSaveAppearance = async (data) => {
    try {
      await updateSettings({ theme: data.theme }).unwrap();
      toast.success("Appearance settings saved!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to save settings.");
    }
  };

  if (isLoadingSettings) return <div>Loading settings...</div>;

  return (
    <>
      <Toaster position="top-center" />
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Tabs defaultValue="account" className="w-full">
          <div className="border-b px-4">
            <TabsList className="bg-transparent p-0 h-auto inline-flex">
              <TabsTrigger
                value="account"
                className="inline-flex items-center justify-center rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 outline-none data-[state=active]:shadow-none bg-transparent"
              >
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="inline-flex items-center justify-center rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 outline-none data-[state=active]:shadow-none bg-transparent"
              >
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="inline-flex items-center justify-center rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 outline-none data-[state=active]:shadow-none bg-transparent"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="inline-flex items-center justify-center rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 outline-none data-[state=active]:shadow-none bg-transparent"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="inline-flex items-center justify-center rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 outline-none data-[state=active]:shadow-none bg-transparent"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="account" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile Information</h3>
                <p className="text-sm text-gray-500">
                  This info is linked to your public profile.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    {...register("fullName")}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard/profile/edit")}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="p-6">
            <form onSubmit={handleSubmit(onSaveSecurity)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Change Password</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                {/* <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-purple-600 hover:bg-purple-700 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdatingPassword ? "Saving..." : "Save Security"}
                </Button> */}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            <form
              onSubmit={handleSubmit(onSaveNotifications)}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium">
                  Notification Preferences
                </h3>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="notificationsEnabled" className="font-medium">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive notifications for sales, comments, etc.
                  </p>
                </div>
                <Controller
                  name="notificationsEnabled"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="notificationsEnabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingSettings}
                  className="bg-purple-600 hover:bg-purple-700 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdatingSettings ? "Saving..." : "Save Notifications"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="billing" className="p-6">
            <div className="text-center text-gray-500 py-8">
              Billing management and subscription details coming soon!
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="p-6">
            <form
              onSubmit={handleSubmit(onSaveAppearance)}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
              </div>
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="text-base font-medium">Theme</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="theme-light"
                    value="light"
                    {...register("theme")}
                  />
                  <Label htmlFor="theme-light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="theme-dark"
                    value="dark"
                    {...register("theme")}
                  />
                  <Label htmlFor="theme-dark">Dark</Label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingSettings}
                  className="bg-purple-600 hover:bg-purple-700 gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdatingSettings ? "Saving..." : "Save Appearance"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
