import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
}

/**
 * Verify user session and return user data
 * In a real app, this would verify JWT token or session cookie
 */
export async function verifyAuth(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    // Get user ID from header (in real app, would decode from JWT/session)
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

/**
 * Verify if user is admin
 */
export async function verifyAdmin(
  request: NextRequest
): Promise<AuthUser | null> {
  const user = await verifyAuth(request);

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

/**
 * Middleware wrapper to require authentication
 */
export function requireAuth(
  handler: (
    request: NextRequest,
    user: AuthUser,
    context?: any
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, user, context);
  };
}

/**
 * Middleware wrapper to require admin authentication
 */
export function requireAdmin(
  handler: (
    request: NextRequest,
    user: AuthUser,
    context?: any
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    return handler(request, user, context);
  };
}
