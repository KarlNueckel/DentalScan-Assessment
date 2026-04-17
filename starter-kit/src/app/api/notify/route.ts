import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scanId, status } = body;

    if (!scanId) {
      return NextResponse.json({ error: "Missing scanId" }, { status: 400 });
    }

    if (status === "completed") {
      // TODO: Replace with real clinic routing logic (e.g., look up which clinic owns this scan)
      const userId = "clinic-1";

      // Fire notification async — don't await so caller isn't blocked
      prisma.notification
        .create({
          data: {
            userId,
            title: "New Scan Ready for Review",
            message: `Patient scan ${scanId} has been completed and is ready for review.`,
          },
        })
        .catch((err) => console.error("[Notification] DB write failed:", err));

      return NextResponse.json({ ok: true, message: "Notification triggered" });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Notification API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
