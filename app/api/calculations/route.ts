import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const OperationType = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
} as const;

// GET all calculation trees
export async function GET() {
  try {
    const calculations = await prisma.calculationNode.findMany({
      where: {
        isRoot: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        children: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            children: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
                children: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                      },
                    },
                    children: {
                      include: {
                        user: {
                          select: {
                            id: true,
                            username: true,
                          },
                        },
                        children: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new root calculation or operation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, isRoot, value, operation, rightOperand, parentId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (isRoot) {
      // Create a root node (starting number)
      if (value === undefined || value === null) {
        return NextResponse.json(
          { error: 'Value is required for root nodes' },
          { status: 400 }
        );
      }

      const node = await prisma.calculationNode.create({
        data: {
          userId,
          isRoot: true,
          value: parseFloat(value),
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return NextResponse.json(node, { status: 201 });
    } else {
      // Create an operation node
      if (!parentId || !operation || rightOperand === undefined) {
        return NextResponse.json(
          { error: 'Parent ID, operation, and right operand are required' },
          { status: 400 }
        );
      }

      // Validate operation type
      if (!Object.values(OperationType).includes(operation)) {
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
      }

      // Get parent node
      const parent = await prisma.calculationNode.findUnique({
        where: { id: parentId },
      });

      if (!parent) {
        return NextResponse.json(
          { error: 'Parent node not found' },
          { status: 404 }
        );
      }

      // Calculate result
      const leftOperand = parent.value;
      const right = parseFloat(rightOperand);
      let result: number;

      switch (operation) {
        case OperationType.ADD:
          result = leftOperand + right;
          break;
        case OperationType.SUBTRACT:
          result = leftOperand - right;
          break;
        case OperationType.MULTIPLY:
          result = leftOperand * right;
          break;
        case OperationType.DIVIDE:
          if (right === 0) {
            return NextResponse.json(
              { error: 'Cannot divide by zero' },
              { status: 400 }
            );
          }
          result = leftOperand / right;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid operation' },
            { status: 400 }
          );
      }

      const node = await prisma.calculationNode.create({
        data: {
          userId,
          isRoot: false,
          value: result,
          operation,
          rightOperand: right,
          parentId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      return NextResponse.json(node, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating calculation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
