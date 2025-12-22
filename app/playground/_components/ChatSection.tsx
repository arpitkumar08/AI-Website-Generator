"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export type Message = {
  role: "user" | "assistant"
  content: string
}

type Props = {
  messages: Message[]
  onSend: (text: string) => void
  loading: boolean
}

const ChatSection = ({ messages, onSend, loading }: Props) => {
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input)
    setInput("")
  }

  return (
    <div className="w-96 shadow h-[91vh] p-2 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div className="p-2 rounded-lg bg-gray-200 max-w-[80%]">
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800" />
              <span className="text-sm text-zinc-600">Thinking</span>
            </div>
          </div>
        )}

      </div>

      <div className="p-3 border-t flex gap-2 items-center">
        <textarea
          value={input}
          placeholder="Describe your website..."
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1 resize-none"
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  )
}

export default ChatSection
