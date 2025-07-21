

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetAllArtworksQuery,
  useDeleteArtworkMutation,
} from "@/lib/api/artworkApi";
import { Toaster, toast } from "react-hot-toast";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Upload,
} from "lucide-react";
import Image from "next/image";

export default function ArtworkPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: artworks = [], isLoading, error } = useGetAllArtworksQuery();
  const [deleteArtwork, { isLoading: isDeleting }] = useDeleteArtworkMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
      try {
        await deleteArtwork(id).unwrap();
        toast.success("Artwork deleted successfully.");
      } catch (err) {
        toast.error(err.data?.message || "Failed to delete artwork.");
      }
    }
  };

  const filteredArtworks = useMemo(() => {
    return artworks.filter((art) =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [artworks, searchQuery]);

  
  if (isLoading) return <div>Loading artworks...</div>;
  if (error)
    return <div className="text-red-500">Error fetching artworks.</div>;

  
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Artwork Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your artworks, upload new pieces, and track sales
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/artwork/add">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add New Artwork
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search artworks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {filteredArtworks.map((artwork) => (
          <Card
            key={artwork._id}
            className="overflow-hidden border-none shadow-sm"
          >
            <div className="relative aspect-square">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 rounded-full"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(artwork._id)}
                      disabled={isDeleting}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900">{artwork.title}</h3>
              <span className="text-sm text-gray-500">
                {artwork.category || "Uncategorized"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArtworks.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <p>No artworks found.</p>
        </div>
      )}
    </>
  );
}
