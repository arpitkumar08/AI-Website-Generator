"use client"

import React, { useEffect, useState } from "react"
import PlaygroundHeader from "../_components/PlaygroundHeader"
import ChatSection from "../_components/ChatSection"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"

/* ================= TYPES ================= */

export type Message = {
  role: "user" | "assistant"
  content: string
}

export type Frame = {
  projectId: string
  frameId: string
  designCode: string | null
  chatMessages: Message[]
}

/* ================= PROMPTS ================= */

// STRICT HTML-ONLY SYSTEM PROMPT
const SYSTEM_HTML_PROMPT = `
You are an HTML code generator. Your response must contain ONLY valid HTML code and nothing else.

CRITICAL RULES:
- Return ONLY HTML code (body content only)
- NO explanations before or after the code
- NO markdown code blocks or backticks
- NO "Here's the code" or "Sure!" or any text
- NO descriptions or comments
- Start directly with opening HTML tag (like <div> or <button>)
- End directly with closing HTML tag
- Use Tailwind CSS for styling
- Use blue as primary color theme
- Make it responsive

Your entire response should be valid HTML that can be immediately inserted into a webpage.
`

// NORMAL CHAT PROMPT
const SYSTEM_CHAT_PROMPT = `
Respond with friendly plain text only.
`

/* ================= HELPERS ================= */

// YOU decide intent — NOT the model
const isWebsiteRequest = (text: string) => {
  return /website|ui|dashboard|html|hero|landing|section|saas/i.test(text)
}

/* ================= COMPONENT ================= */

const PlayGround = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const params = useSearchParams()
  const frameId = params.get("frameId")

  const [frameDetail, setFrameDetail] = useState<Frame | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [loading, setLoading] = useState(false)

  /* ================= LOAD FRAME ================= */

  useEffect(() => {
    if (frameId) loadFrame()
  }, [frameId])

  const loadFrame = async () => {
    const res = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    )

    console.log("📦 FRAME DATA:", res.data)

    setFrameDetail(res.data)
    setMessages(res.data.chatMessages ?? [])

    if(res.data?.chatMessages?.length==1){
      const userMsg = res.data?.chatMessages[0].content;
      sendMessage(userMsg)
    }
  }

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || loading) return

    setLoading(true)
    setGeneratedCode("")

    // Show user message immediately
    setMessages(prev => [...prev, { role: "user", content: userInput }])

    const wantsHTML = isWebsiteRequest(userInput)

    try {
      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: wantsHTML
                ? SYSTEM_HTML_PROMPT
                : SYSTEM_CHAT_PROMPT,
            },
            {
              role: "user",
              content: userInput,
            },
          ],
        }),
      })

      if (!res.ok) {
        console.error("❌ API ERROR:", await res.text())
        return
      }

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let aiResponse = ""

      // Silently accumulate chunks
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        aiResponse += chunk
      }

      // Clean console output
      if (wantsHTML) {
        console.log("✨ GENERATED HTML CODE:")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        console.log(aiResponse.trim())
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        setGeneratedCode(aiResponse.trim())
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "✅ Your code is ready! Check console." },
        ])
      } else {
        console.log("💬 AI RESPONSE:", aiResponse.trim())
        
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: aiResponse.trim() },
        ])
      }
    } catch (err) {
      console.error("❌ SendMessage error:", err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= RENDER ================= */

  return (
    <div>
      <PlaygroundHeader />

      <div className="flex">
        <ChatSection
          messages={messages}
          onSend={sendMessage}
          loading={loading}
        />

        {/* Ready when you want */}
        {/* <WebsiteDesign code={generatedCode} /> */}
      </div>
    </div>
  )
}

export default PlayGround