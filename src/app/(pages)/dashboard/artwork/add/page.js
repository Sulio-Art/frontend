

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useCreateArtworkMutation } from "@/lib/api/artworkApi";
import { Toaster, toast } from "react-hot-toast";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Save } from "lucide-react";
import Image from "next/image";

export default function AddArtworkPage() {
  const router = useRouter();
  const [filePreview, setFilePreview] = useState(null);
  const [createArtwork, { isLoading }] = useCreateArtworkMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm();

  const imageFile = watch("image");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      setFilePreview(URL.createObjectURL(imageFile[0]));
    } else {
      setFilePreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    if (!data.image || data.image.length === 0) {
      return toast.error("Please upload an image for the artwork.");
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("image", data.image[0]);

    try {
      await createArtwork(formData).unwrap();
      toast.success("Artwork created successfully!");
      router.push("/dashboard/artwork");
    } catch (err) {
      toast.error(err.data?.message || "Failed to create artwork.");
    }
  };

  
  return (
    <>
      <Toaster position="top-center" />
      <div className="flex items-center mb-6">
        <Link href="/dashboard/artwork" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Add New Artwork</h1>
          <p className="text-gray-600 mt-1">Create a new artwork listing</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-3">
           
            <CardHeader>
              <CardTitle>Artwork Image</CardTitle>
              <CardDescription>
                Upload a high-quality image of your artwork.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 h-48 bg-gray-50 hover:bg-gray-100">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  {...register("image", { required: "An image is required." })}
                />
                {filePreview ? (
                  <Image
                    src={filePreview}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="object-contain h-full"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to Upload
                    </span>
                  </>
                )}
              </label>
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.image.message}
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2">
            
            <CardHeader>
              <CardTitle>Artwork Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Artwork Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Abstract Dreams"
                  {...register("title", { required: "Title is required." })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your artwork..."
                  className="min-h-[120px]"
                  {...register("description", {
                    required: "Description is required.",
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required." }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Illustration">
                          Illustration
                        </SelectItem>
                        <SelectItem value="Painting">Painting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <div className="col-span-1 md:col-span-3 flex justify-end gap-4">
            <Link href="/dashboard/artwork">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Publishing..." : "Publish Artwork"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
