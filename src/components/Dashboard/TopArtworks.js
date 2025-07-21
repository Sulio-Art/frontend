"use client";

import { useMemo } from "react";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Heart, Eye, DollarSign } from "lucide-react";

export function TopArtworks() {
  const { data: allArtworks = [], isLoading } = useGetAllArtworksQuery();
  const { user } = useSelector((state) => state.auth);

  const topArtworks = useMemo(() => {
    if (!user) return [];

    return allArtworks
      .filter((art) => art.createdBy._id === user.id)
      .map((art) => ({
        ...art,
        views: Math.floor(Math.random() * 2000),
        likes: Math.floor(Math.random() * 500),
        price: Math.floor(Math.random() * 250) + 50,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  }, [allArtworks, user]);

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Top Artworks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-3 animate-pulse"
              >
                <div className="w-16 h-16 rounded-md bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Top Artworks</CardTitle>
      </CardHeader>
      <CardContent>
        {topArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topArtworks.map((artwork) => (
              <div
                key={artwork._id}
                className="flex items-center space-x-4 border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="absolute inset-0 rounded-md overflow-hidden">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {artwork.views}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Heart className="h-3 w-3 mr-1" />
                      {artwork.likes}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {artwork.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Upload artworks to see your top performers here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
