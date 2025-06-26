"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Calendar, 
  Image as ImageIcon, 
  Save,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  PenSquare,
  Trash2,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DiaryPage() {
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
  const [newEntry, setNewEntry] = useState({
    content: "",
    mood: "Neutral",
    tags: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch diary entries from backend
  useEffect(() => {
    async function fetchEntries() {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary`, {
          credentials: "include"
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch diary entries")
        setEntries(data.entries || data) // adjust if your backend returns {entries: [...]}
      } catch (err) {
        setError(err.message)
      }
      setLoading(false)
    }
    fetchEntries()
  }, [])

  // Handle creating a new entry
  const handleCreateEntry = async () => {
    if (!newEntry.content.trim()) {
      setError("Content is required")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newEntry.content,
          mood: newEntry.mood,
          tags: newEntry.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save entry")
      setEntries([data, ...entries])
      setSuccess("Entry saved successfully!")
      setNewEntry({ content: "", mood: "Neutral", tags: "" })
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Daily Diary</h1>
              <p className="text-gray-600 mt-1">Keep track of your creative journey and artistic progress</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setSelectedEntry(null)}>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar and Entry List */}
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
                  {entries.map((entry) => (
                    <div 
                      key={entry._id || entry.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedEntry === (entry._id || entry.id) ? "bg-purple-50 border border-purple-200" : "border border-gray-100"
                      }`}
                      onClick={() => setSelectedEntry(entry._id || entry.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{entry.date || new Date(entry.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800`}>
                          {entry.mood}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(entry.tags || []).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {loading && <div className="text-center text-gray-500 py-4">Loading...</div>}
                  {error && <div className="text-center text-red-600 py-2">{error}</div>}
                </div>
              </CardContent>
            </Card>
            {/* Entry Editor / Viewer */}
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-lg font-medium text-gray-900">
                      {selectedEntry 
                        ? (entries.find(e => (e._id || e.id) === selectedEntry)?.date || new Date(entries.find(e => (e._id || e.id) === selectedEntry)?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
                        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  {selectedEntry && (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 text-gray-500 gap-1.5">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-blue-600 gap-1.5">
                        <PenSquare className="h-4 w-4" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {selectedEntry ? (
                  // View/Edit existing entry
                  <div>
                    <p className="text-gray-800 whitespace-pre-line">
                      {entries.find(e => (e._id || e.id) === selectedEntry)?.content}
                    </p>
                    <div className="flex items-center mt-6 pt-4 border-t border-gray-100">
                      <div className="mr-6">
                        <span className="text-sm text-gray-500 mr-2">Mood:</span>
                        <span className="text-sm font-medium">
                          {entries.find(e => (e._id || e.id) === selectedEntry)?.mood}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 mr-2">Tags:</span>
                        <div className="inline-flex flex-wrap gap-1">
                          {(entries.find(e => (e._id || e.id) === selectedEntry)?.tags || []).map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // New entry form
                  <div className="space-y-4">
                    <Textarea 
                      placeholder="Write your thoughts, ideas, and progress here..."
                      className="min-h-[200px] resize-none"
                      value={newEntry.content}
                      onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                      disabled={loading}
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Mood</label>
                        <Select 
                          value={newEntry.mood}
                          onValueChange={(value) => setNewEntry({...newEntry, mood: value})}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select your mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inspired">Inspired</SelectItem>
                            <SelectItem value="Happy">Happy</SelectItem>
                            <SelectItem value="Excited">Excited</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem>
                            <SelectItem value="Frustrated">Frustrated</SelectItem>
                            <SelectItem value="Tired">Tired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="sketch, digital, portrait"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newEntry.tags}
                          onChange={e => setNewEntry({...newEntry, tags: e.target.value})}
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        disabled
                      >
                        <ImageIcon className="h-4 w-4" />
                        Add Image
                      </Button>
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        className="px-4"
                        onClick={() => setNewEntry({ content: "", mood: "Neutral", tags: "" })}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                        onClick={handleCreateEntry}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4" />
                        {loading ? "Saving..." : "Save Entry"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}