import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

/**
 * PATCH /api/admin/reviews/[id]
 * Approve or reject a review (admin only)
 */
export const PATCH = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        publication: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // If approved, update publication rating
    if (status === 'approved') {
      const approvedReviews = await prisma.review.findMany({
        where: {
          publicationId: review.publicationId,
          status: 'approved',
        },
        select: {
          rating: true,
        },
      });

      const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / approvedReviews.length;

      await prisma.publication.update({
        where: { id: review.publicationId },
        data: {
          rating: avgRating,
          reviewCount: approvedReviews.length,
        },
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
});

/**
 * GET /api/admin/reviews/[id]
 * Get a specific review (admin only)
 */
export const GET = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        publication: {
          select: {
            id: true,
            title: true,
            type: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/reviews/[id]
 * Delete a review (admin only)
 */
export const DELETE = requireAdmin(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Get review details before deleting
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        publicationId: true,
        status: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: { id },
    });

    // If the deleted review was approved, recalculate publication rating
    if (review.status === 'approved') {
      const approvedReviews = await prisma.review.findMany({
        where: {
          publicationId: review.publicationId,
          status: 'approved',
        },
        select: {
          rating: true,
        },
      });

      if (approvedReviews.length > 0) {
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / approvedReviews.length;

        await prisma.publication.update({
          where: { id: review.publicationId },
          data: {
            rating: avgRating,
            reviewCount: approvedReviews.length,
          },
        });
      } else {
        // No more approved reviews, reset to 0
        await prisma.publication.update({
          where: { id: review.publicationId },
          data: {
            rating: 0,
            reviewCount: 0,
          },
        });
      }
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
});
