import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

const ViewCodeBlock = ({ children, code }: any) => {

  const handleCopy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    toast.success('Code Copied!')
  }

  return (
    <Dialog>
      {/* ✅ IMPORTANT FIX */}
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="min-w-7xl max-h-[600px] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            Source Code
            <Button size="sm" onClick={handleCopy}>
              <Copy />
            </Button>
          </DialogTitle>

          <DialogDescription asChild>
            <div>
              <SyntaxHighlighter language="html">
                {code}
              </SyntaxHighlighter>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCodeBlock
