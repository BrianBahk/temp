import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/users/me
 * Get current user info
 */
export const GET = requireAuth(async (request: NextRequest, user) => {
  return NextResponse.json(user);
});
