"use client";

import React from "react";
import { useGetAllArtworksQuery } from "@/lib/api/artworkApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArtworkStats() {
  const { data: artworks = [], isLoading } = useGetAllArtworksQuery();

  const artworkCategories = React.useMemo(() => {
    if (!artworks || artworks.length === 0) return [];

    const categoryCounts = artworks.reduce((acc, art) => {
      const category = art.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const totalArtworks = artworks.length;
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    const strokeColors = {
      "--purple-500": "#a855f7",
      "--blue-500": "#3b82f6",
      "--green-500": "#22c55e",
      "--yellow-500": "#eab308",
      "--pink-500": "#ec4899",
    };

    return Object.entries(categoryCounts).map(([name, count], index) => ({
      name,
      count,
      percentage: Math.round((count / totalArtworks) * 100),
      color: colors[index % colors.length],
      strokeColors,
    }));
  }, [artworks]);

  if (isLoading)
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Artwork Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading stats...</p>
        </CardContent>
      </Card>
    );
  if (artworkCategories.length === 0)
    return (
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Artwork Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No artwork data available.</p>
        </CardContent>
      </Card>
    );

  const circumference = 440;
  let currentOffset = 0;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Artwork Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center my-2">
          <div className="relative w-36 h-36">
            <svg width="100%" height="100%" viewBox="0 0 160 160">
              {artworkCategories.map((category, index) => {
                const dashArray = circumference * (category.percentage / 100);
                const dash = `${dashArray} ${circumference - dashArray}`;
                const offset = currentOffset;
                currentOffset += dashArray;

                return (
                  <circle
                    key={index}
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke={category.color.replace("bg-", "var(--")}
                    strokeWidth="20"
                    strokeDasharray={dash}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 80 80)"
                    style={category.strokeColors}
                  />
                );
              })}
              <text
                x="80"
                y="80"
                fontSize="24"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontWeight="bold"
                fill="#111827"
              >
                {artworks.length}
              </text>
              <text
                x="80"
                y="100"
                fontSize="12"
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#6b7280"
              >
                Artworks
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {artworkCategories.map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs text-gray-600">{category.name}</span>
                <span className="text-xs font-medium">
                  {category.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
