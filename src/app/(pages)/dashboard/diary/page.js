"use client";

import { useState } from "react";
import {
  useGetMyDiaryEntriesQuery,
  useCreateDiaryEntryMutation,
  useDeleteDiaryEntryMutation,
} from "@/lib/api/diaryApi";
import { Toaster, toast } from "react-hot-toast";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Calendar,
  Save,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Eye,
  PenSquare,
} from "lucide-react";

const emptyNewEntry = { content: "", mood: "Neutral" };

export default function DiaryPage() {
  const { data: entries = [], isLoading: isLoadingEntries } =
    useGetMyDiaryEntriesQuery();
  const [createDiaryEntry, { isLoading: isCreating }] =
    useCreateDiaryEntryMutation();
  const [deleteDiaryEntry, { isLoading: isDeleting }] =
    useDeleteDiaryEntryMutation();

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState(emptyNewEntry);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  const handleCreateEntry = async () => {
    if (!newEntry.content.trim()) return toast.error("Content is required.");
    try {
      await createDiaryEntry(newEntry).unwrap();
      toast.success("Entry saved!");
      setNewEntry(emptyNewEntry);
    } catch (err) {
      toast.error(err.data?.message || "Failed to save.");
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteDiaryEntry(id).unwrap();
        toast.success("Entry deleted.");
        if (selectedEntry?._id === id) setSelectedEntry(null);
      } catch (err) {
        toast.error("Failed to delete.");
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <div>
          
          <h1 className="text-3xl font-semibold text-gray-900">Daily Diary</h1>
          <p className="text-gray-600 mt-1">Track your creative journey</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setSelectedEntry(null)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Entries</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{currentMonth}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoadingEntries && (
                <p className="text-center text-sm text-gray-500 py-4">
                  Loading entries...
                </p>
              )}
              {!isLoadingEntries && entries.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  No entries yet. Create one!
                </p>
              )}
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedEntry?._id === entry._id
                      ? "bg-purple-50 border-purple-200"
                      : "border-gray-100 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-lg font-medium">
                  {selectedEntry
                    ? new Date(selectedEntry.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                </span>
              </div>
              {selectedEntry && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteEntry(selectedEntry._id)}
                      disabled={isDeleting}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {selectedEntry ? (
              <div>
                <p className="text-gray-800 whitespace-pre-line">
                  {selectedEntry.content}
                </p>
                <div className="mt-6 pt-4 border-t">
                  <span className="text-sm text-gray-500 mr-2">Mood:</span>
                  <span className="text-sm font-medium">
                    {selectedEntry.mood}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your thoughts..."
                  className="min-h-[200px]"
                  value={newEntry.content}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, content: e.target.value })
                  }
                  disabled={isCreating}
                />
                <div className="flex gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mood</label>
                    <Select
                      value={newEntry.mood}
                      onValueChange={(value) =>
                        setNewEntry({ ...newEntry, mood: value })
                      }
                      disabled={isCreating}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inspired">Inspired</SelectItem>
                        <SelectItem value="Happy">Happy</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Frustrated">Frustrated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setNewEntry(emptyNewEntry)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateEntry}
                    disabled={isCreating}
                    className="bg-purple-600 hover:bg-purple-700 gap-1.5"
                  >
                    <Save className="h-4 w-4" />
                    {isCreating ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
