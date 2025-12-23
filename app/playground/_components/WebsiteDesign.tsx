"use client"

import React, { useEffect, useRef, useState } from "react"
import WebPageTools from "./WebPageTools"

type Props = {
  generatedCode: string
}

// ✅ HTML builder (correct usage)
const HTML_CODE = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Tailwind (browser version) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- Flowbite -->
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css"
    rel="stylesheet"
  />
</head>
<body class="bg-white p-4">
  ${body}
</body>
</html>
`

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [selectedScreenSize, setSelectedScreenSize] = useState("web")

  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    // ✅ Clean markdown fences
    const cleanCode =
      generatedCode?.replace(/```html|```/g, "") || ""

    // ✅ Write FULL HTML
    doc.open()
    doc.write(HTML_CODE(cleanCode))
    doc.close()

    let hoverEl: HTMLElement | null = null
    let selectedEl: HTMLElement | null = null

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEl) return
      const target = e.target as HTMLElement
      if (hoverEl && hoverEl !== target) {
        hoverEl.style.outline = ""
      }
      hoverEl = target
      hoverEl.style.outline = "2px dotted blue"
    }

    const handleMouseOut = () => {
      if (selectedEl) return
      if (hoverEl) {
        hoverEl.style.outline = ""
        hoverEl = null
      }
    }

    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const target = e.target as HTMLElement

      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = ""
        selectedEl.removeAttribute("contenteditable")
      }

      selectedEl = target
      selectedEl.style.outline = "2px solid red"
      selectedEl.setAttribute("contenteditable", "true")
      selectedEl.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = ""
        selectedEl.removeAttribute("contenteditable")
        selectedEl = null
      }
    }

    doc.body?.addEventListener("mouseover", handleMouseOver)
    doc.body?.addEventListener("mouseout", handleMouseOut)
    doc.body?.addEventListener("click", handleClick)
    doc.addEventListener("keydown", handleKeyDown)

    // ✅ Cleanup
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver)
      doc.body?.removeEventListener("mouseout", handleMouseOut)
      doc.body?.removeEventListener("click", handleClick)
      doc.removeEventListener("keydown", handleKeyDown)
    }
  }, [generatedCode]) // ✅ IMPORTANT dependency

  return (
    <div className="p-5 w-full flex flex-col items-center gap-4">
      <iframe
        ref={iframeRef}
        className={`${
          selectedScreenSize === "web" ? "w-full" : "w-[375px]"
        } h-[600px] border-2 rounded-xl`}
        sandbox="allow-scripts allow-same-origin"
      />

      <WebPageTools
        selectedScreenSize={selectedScreenSize}
        setSelectedScreenSize={setSelectedScreenSize}
        generatedCode={generatedCode}
      />
    </div>
  )
}

export default WebsiteDesign
