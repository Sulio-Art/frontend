

"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "@/lib/api/chatApi";


import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw, Settings, ImageIcon, Sparkles } from "lucide-react";

const initialMessages = [
  {
    id: 1,
    role: "bot",
    content:
      "Hello! I'm your AI assistant. How can I help you with your art today?",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export default function ChatbotPage() {
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    try {
      const igid = user?._id || "demo-user-id";
      const task = "general";
      const botResponse = await sendMessage({
        query: currentInput,
        igid,
        task,
      }).unwrap();
      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: botResponse.response || "Sorry, I encountered an issue.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: `Error: ${err.data?.message || "Could not connect to the AI assistant."}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">AI Chatbot</h1>
          <p className="text-gray-600 mt-1">
            Get assistance with your art, ideas, and business
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={isLoading}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Card className="flex-1 flex flex-col border-none shadow-sm overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${message.role === "user" ? "bg-purple-600 text-white" : "bg-white border"}`}
              >
                {message.role === "bot" && (
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      AI Assistant
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {message.timestamp}
                    </span>
                  </div>
                )}
                <p
                  className={`text-sm ${message.role === "user" ? "text-white" : "text-gray-800"}`}
                >
                  {message.content}
                </p>
                {message.role === "user" && (
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-purple-200">
                      {message.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
              disabled
            >
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="relative flex-1">
              <Input
                placeholder="Ask anything about art..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-12 h-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-purple-600 hover:bg-purple-700"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="text-xs text-gray-500 flex items-center">
              <Sparkles className="h-3 w-3 mr-1 text-purple-600" />
              Powered by AI Assistant
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
