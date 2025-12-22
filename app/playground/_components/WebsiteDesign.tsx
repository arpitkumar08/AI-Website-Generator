"use client"

import React, { useEffect, useRef } from "react"

type Props = {
  generatedCode: string
}

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    doc.open()
    doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body id="root"></body>
</html>
    `)
    doc.close()
  }, [])

  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return

    const root = doc.getElementById("root")
    if (root) {
      root.innerHTML = generatedCode ?? ""
    }
  }, [generatedCode])

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[700px] border"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}

export default WebsiteDesign
