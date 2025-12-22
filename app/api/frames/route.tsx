import { db } from "@/config/db"
import { chatTable, frameTable } from "@/config/schema"
import { and, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

/* ================= GET FRAME ================= */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const frameId = searchParams.get("frameId")
  const projectId = searchParams.get("projectId")

  if (!frameId || !projectId) {
    return NextResponse.json(
      { error: "Missing frameId or projectId" },
      { status: 400 }
    )
  }

  const frameResult = await db
    .select()
    .from(frameTable)
    .where(
      and(
        eq(frameTable.frameId, frameId),
        eq(frameTable.projectId, projectId)
      )
    )

  if (!frameResult.length) {
    return NextResponse.json(
      { error: "Frame not found" },
      { status: 404 }
    )
  }

  const chatResult = await db
    .select()
    .from(chatTable)
    .where(eq(chatTable.frameId, frameId))

  return NextResponse.json({
    ...frameResult[0],
    chatMessages: chatResult.flatMap(c => c.chatMessage),
  })
}

/* ================= SAVE FRAME ================= */

export async function PUT(req: NextRequest) {
  const { designCode, frameId, projectId } = await req.json()

  await db
    .update(frameTable)
    .set({ designCode })
    .where(
      and(
        eq(frameTable.frameId, frameId),
        eq(frameTable.projectId, projectId)
      )
    )

  return NextResponse.json({ success: true })
}
