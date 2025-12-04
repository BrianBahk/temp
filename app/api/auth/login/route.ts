import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        points: true,
        subscriptions: {
          where: { status: 'active' },
          select: {
            id: true,
            publicationId: true,
            startDate: true,
            endDate: true,
            status: true,
            orderNumber: true,
            publication: {
              select: {
                title: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    // Transform subscriptions to match frontend format
    const formattedSubscriptions = user.subscriptions.map(sub => ({
      id: sub.id,
      publicationId: sub.publicationId,
      publicationTitle: sub.publication.title,
      type: sub.publication.type,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate.toISOString(),
      status: sub.status,
      orderNumber: sub.orderNumber,
    }));

    return NextResponse.json({
      ...userWithoutPassword,
      subscriptions: formattedSubscriptions,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
