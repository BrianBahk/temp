import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: [{ featured: "desc" }, { rating: "desc" }],
    });
    return NextResponse.json(publications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}
