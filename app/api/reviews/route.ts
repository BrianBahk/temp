import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/reviews?publicationId=xxx&status=approved
 * Fetch reviews for a publication
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get('publicationId');
    const status = searchParams.get('status') || 'approved';

    if (!publicationId) {
      return NextResponse.json(
        { error: 'Publication ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        publicationId,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Create a new review (requires authentication and purchase verification)
 */
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { publicationId, rating, comment } = body;

    // Validate input
    if (!publicationId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input. Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has purchased this publication
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        publicationId,
        order: {
          userId: user.id,
          status: 'completed',
        },
      },
    });

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'You can only review items you have purchased' },
        { status: 403 }
      );
    }

    // Check if user already reviewed this publication
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        publicationId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this publication' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        publicationId,
        rating,
        comment: comment || '',
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
});
