import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

const TAX_RATE = 0.0825; // 8.25% tax for magazines

/**
 * POST /api/orders
 * Create a new order from cart items
 */
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { pointsToUse = 0 } = body;

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        publication: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate subtotal and tax
    let subtotal = 0;
    let tax = 0;

    for (const item of cartItems) {
      const itemTotal = item.publication.price * item.quantity;
      subtotal += itemTotal;

      // Apply tax only to magazines
      if (item.publication.type === 'magazine') {
        tax += itemTotal * TAX_RATE;
      }
    }

    const totalBeforePoints = subtotal + tax;

    // Validate points usage
    if (pointsToUse > 0) {
      if (pointsToUse > user.points) {
        return NextResponse.json(
          { error: 'Insufficient points' },
          { status: 400 }
        );
      }

      // Can't use more points than the order total
      if (pointsToUse > totalBeforePoints) {
        return NextResponse.json(
          { error: 'Points exceed order total' },
          { status: 400 }
        );
      }
    }

    const total = totalBeforePoints - pointsToUse;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          subtotal,
          tax,
          pointsUsed: pointsToUse,
          total,
          status: 'completed',
          orderItems: {
            create: cartItems.map((item) => ({
              publicationId: item.publicationId,
              quantity: item.quantity,
              price: item.publication.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              publication: true,
            },
          },
        },
      });

      // Deduct points if used
      if (pointsToUse > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            points: {
              decrement: pointsToUse,
            },
          },
        });
      }

      // Award points (1 point per dollar spent, rounded down)
      const pointsEarned = Math.floor(total);
      if (pointsEarned > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            points: {
              increment: pointsEarned,
            },
            pointsEarned: {
              increment: pointsEarned,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
});

/**
 * GET /api/orders
 * Get user's order history
 */
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            publication: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
});
