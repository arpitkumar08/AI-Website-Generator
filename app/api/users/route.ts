import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json({
        user: existingUser[0],
        created: false,
      });
    }

    // Create new user
    const insertedUser = await db
      .insert(usersTable)
      .values({
        name: clerkUser.fullName ?? "NA",
        email,
        credits: 2,
      })
      .returning();

    return NextResponse.json({
      user: insertedUser[0],
      created: true,
    });
  } catch (error) {
    console.error("❌ /api/users failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
