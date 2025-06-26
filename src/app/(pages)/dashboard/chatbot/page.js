"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/Dashboard/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Send, 
  RefreshCw, 
  Settings, 
  Image as ImageIcon, 
  Sparkles
} from "lucide-react"
import Image from "next/image"

const initialMessages = [
  {
    id: 1,
    role: "bot",
    content: "Hello! I'm your AI assistant. How can I help you with your art today?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef(null)

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || loading) return

    setError("")
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setLoading(true)

    try {
      // You may want to get igid and task from user context or session
      const igid = "demo-igid" // Replace with real user/session IGID
      const task = "general"    // Or let user pick a task

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: userMessage.content,
          igid,
          task
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "AI failed to respond.")
        setLoading(false)
        return
      }

      const botMessage = {
        id: messages.length + 2,
        role: "bot",
        content: data.response || "AI did not return a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      setError("Network error. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">AI Chatbot</h1>
              <p className="text-gray-600 mt-1">Get assistance with your art, ideas, and business</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <Button variant="outline" size="icon" className="h-9 w-9" disabled={loading}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" disabled={loading}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Card className="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-purple-600 text-white" 
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    {message.role === "bot" && (
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <Sparkles className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">AI Assistant</span>
                        <span className="text-xs text-gray-400 ml-2">{message.timestamp}</span>
                      </div>
                    )}
                    <p className={`text-sm ${message.role === "user" ? "text-white" : "text-gray-800"}`}>
                      {message.content}
                    </p>
                    {message.role === "user" && (
                      <div className="flex justify-end mt-1">
                        <span className="text-xs text-purple-200">{message.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" disabled>
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </Button>
                <div className="relative flex-1">
                  <Input 
                    placeholder="Ask anything about art..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pr-12 h-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    disabled={loading}
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-1 top-1 h-8 w-8 bg-purple-600 hover:bg-purple-700"
                    onClick={handleSendMessage}
                    disabled={loading}
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-red-600 text-sm mt-2">{error}</div>
              )}
              <div className="flex items-center justify-center mt-4">
                <div className="text-xs text-gray-500 flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 text-purple-600" />
                  Powered by AI Assistant
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}