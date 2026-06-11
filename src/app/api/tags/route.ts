import { NextResponse } from "next/server";
import { tagService } from "@/services/tagService";

export const runtime = "edge";

export async function GET() {
  try {
    const tags = await tagService.getTags();

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
