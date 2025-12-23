import { Button } from '@/components/ui/button'
import {
  Code2Icon,
  Download,
  Monitor,
  SquareArrowOutUpRight,
  TabletSmartphone
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ViewCodeBlock from './ViewCodeBlock'

const buildHTML = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Optional libraries -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
</head>
<body class="bg-white p-4">
  ${body}
</body>
</html>
`

type Props = {
  selectedScreenSize: string
  setSelectedScreenSize: (v: string) => void
  generatedCode: string
}

const WebPageTools = ({
  selectedScreenSize,
  setSelectedScreenSize,
  generatedCode
}: Props) => {

  const [finalCode, setFinalCode] = useState('')

  useEffect(() => {
    const clean = generatedCode
      ?.replace(/```html|```/g, '') || ''

    setFinalCode(buildHTML(clean))
  }, [generatedCode])

  const viewInNewTab = () => {
    const blob = new Blob([finalCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  const downloadCode = () => {
    const blob = new Blob([finalCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-2 shadow rounded-xl w-full flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className={selectedScreenSize === 'web' ? 'border border-primary' : ''}
          onClick={() => setSelectedScreenSize('web')}
        >
          <Monitor />
        </Button>

        <Button
          variant="ghost"
          className={selectedScreenSize === 'mobile' ? 'border border-primary' : ''}
          onClick={() => setSelectedScreenSize('mobile')}
        >
          <TabletSmartphone />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={viewInNewTab}>
          View <SquareArrowOutUpRight />
        </Button>

        <ViewCodeBlock code={finalCode}>
          <Button>
            Code <Code2Icon />
          </Button>
        </ViewCodeBlock>

        <Button onClick={downloadCode}>
          Download <Download />
        </Button>
      </div>
    </div>
  )
}

export default WebPageTools
