"use client"

import React, { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import axios from "axios"

import PlaygroundHeader from "../_components/PlaygroundHeader"
import ChatSection from "../_components/ChatSection"
import WebsiteDesign from "../_components/WebsiteDesign"
import { toast } from "sonner"

/* ================= TYPES ================= */

export type Message = {
  role: "user" | "assistant"
  content: string
}

/* ================= SINGLE SYSTEM PROMPT ================= */

const SYSTEM_PROMPT = `
You are an AI assistant that can either:
1) Generate UI code (HTML/CSS), or
2) Respond with plain text.

Decision rule (VERY IMPORTANT):
- If the user is asking for ANY kind of screen, page, UI, layout, form, component,
  website, flow, section, card, visual interface, or design — YOU MUST generate HTML.
- This includes signup screens, login forms, dashboards, pricing pages, admin panels,
  profile pages, settings screens, or ANY design-related request.
- Even vague words like "screen", "page", "form", or "layout" MUST be treated as UI requests.

HTML generation rules:
- Return ONLY valid HTML.
- BODY CONTENT ONLY (no <html>, <head>, or <body> tags).
- Use Tailwind CSS.
- Fully responsive.
- NO explanations.
- NO markdown.
- NO backticks.

If the user is NOT asking for a UI or visual interface:
- Respond with friendly plain text only.
`

/* ================= COMPONENT ================= */

const PlayGround = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const params = useSearchParams()
  const frameId = params.get("frameId")

  const [messages, setMessages] = useState<Message[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [loading, setLoading] = useState(false)

  /* ================= LOAD FRAME ON REFRESH ================= */

  useEffect(() => {
    if (frameId && projectId) {
      loadFrame()
    }
  }, [frameId, projectId])

  const loadFrame = async () => {
    try {
      const res = await axios.get("/api/frames", {
        params: { frameId, projectId },
      })

      if (res.data?.designCode) {
        setGeneratedCode(res.data.designCode)
      }

      if (res.data?.chatMessages) {
        setMessages(res.data.chatMessages)
      }
    } catch (err) {
      console.error("Failed to load frame", err)
    }
  }

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async (userInput: string) => {
    if (!userInput.trim() || loading) return

    setLoading(true)
    setGeneratedCode("")

    setMessages(prev => [...prev, { role: "user", content: userInput }])

    try {
      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userInput },
          ],
        }),
      })

      if (!res.ok) throw new Error("API failed")

      const reader = res.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      let aiResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        aiResponse += decoder.decode(value, { stream: true })
      }

      const cleanedResponse = aiResponse
        .replace(/```[a-z]*|```/gi, "")
        .trim()

      // 🔑 SIMPLE DETECTION: HTML vs TEXT
      if (cleanedResponse.startsWith("<")) {
        setGeneratedCode(cleanedResponse)
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "Your Code is Ready!" },
        ])
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: cleanedResponse },
        ])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= SAVE HTML ONLY ================= */

  useEffect(() => {
    if (
      !loading &&
      generatedCode &&
      generatedCode.startsWith("<")
    ) {
      saveGeneratedCode()
    }
  }, [generatedCode, loading])

  const saveGeneratedCode = async () => {
    await axios.put("/api/frames", {
      designCode: generatedCode,
      frameId,
      projectId,
    })

    toast.success("Website is Ready!")
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

        <WebsiteDesign generatedCode={generatedCode} />
      </div>
    </div>
  )
}

export default PlayGround
