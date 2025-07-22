// src/app/(pages)/dashboard/profile/page.js

"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery } from "@/lib/api/profileApi";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Image as ImageIcon,
  DollarSign,
  Users,
  Star,
  Edit,
  Share2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock for BarChart component
function BarChart(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetMyProfileQuery();
  const { data: allArtworks = [], isLoading: isLoadingArtworks } =
    useGetAllArtworksQuery();

  const profileData = useMemo(() => {
    if (!user || !profile) return null;
    return {
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      username: profile.username || user.email.split("@")[0],
      email: user.email,
      phone: user.phoneNumber,
      joinedDate: user
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "N/A",
      bio: profile.bio,
      avatar: profile.profilePicture,
      location: profile.location,
      socialLinks: profile.socialLinks || {},
    };
  }, [user, profile]);

  const userPortfolio = useMemo(() => {
    if (!user || !allArtworks) return [];
    return allArtworks.filter(
      (art) => art.createdBy && art.createdBy._id === user.id
    );
  }, [user, allArtworks]);

  const stats = useMemo(
    () => ({
      artworks: userPortfolio.length,
      sales: "N/A",
      revenue: "N/A",
      followers: "N/A",
      avgRating: "N/A",
    }),
    [userPortfolio]
  );

  const isLoading = isLoadingProfile || isLoadingArtworks;
  if (isLoading)
    return <div className="text-center p-10">Loading Profile...</div>;
  if (profileError || !profileData)
    return (
      <div className="text-center p-10 text-red-500">
        Could not load profile data.
      </div>
    );

  return (
    <>
      {/* Profile Header */}
      <Card className="mb-8 overflow-visible border-none bg-transparent shadow-none">
        {/* Gradient Banner */}
        <div className="relative h-48 md:h-64 w-full rounded-lg bg-gradient-to-r from-purple-400 to-pink-500">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href="/dashboard/profile/edit">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* DEFINITIVE FIX: New structure for Avatar and Name */}
        <div className="relative px-6">
          <div className="-mt-16 sm:-mt-20">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-gray-50">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="bg-purple-500 text-white text-3xl">
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              {profileData.name}
            </h1>
            <p className="text-gray-500">@{profileData.username}</p>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">
              Portfolio ({stats.artworks})
            </TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.location && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <span>Joined {profileData.joinedDate}</span>
                  </div>
                  <Separator className="my-4" />
                  <h3 className="font-medium text-sm text-gray-500 uppercase mb-3">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {profileData.socialLinks.instagram && (
                      <a
                        href={"https://" + profileData.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:text-purple-600"
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </a>
                    )}
                    {profileData.socialLinks.twitter && (
                      <a
                        href={"https://" + profileData.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:text-purple-600"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </a>
                    )}
                    {profileData.socialLinks.website && (
                      <a
                        href={"https://" + profileData.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:text-purple-600"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.bio ||
                      'No bio provided. Click "Edit Profile" to add one.'}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.artworks}
                      </div>
                      <div className="text-sm text-gray-500">Artworks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.sales}
                      </div>
                      <div className="text-sm text-gray-500">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.revenue}
                      </div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.followers}
                      </div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.avgRating}
                      </div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Portfolio</CardTitle>
                  <Link href="/dashboard/artwork/add">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add New Artwork
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Showcase of all your published artwork
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {userPortfolio.map((item) => (
                    <div
                      key={item._id}
                      className="relative rounded-lg overflow-hidden group"
                    >
                      <div className="aspect-[4/3] bg-gray-200 relative">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                {userPortfolio.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      You haven&apos;t added any artworks yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="text-center py-12 text-gray-500">
              <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Detailed sales and audience statistics are coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
