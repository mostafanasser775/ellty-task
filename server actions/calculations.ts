'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { revalidatePath } from 'next/cache';

const OperationType = {
  ADD: 'ADD',
  SUBTRACT: 'SUBTRACT',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
} as const;

type OperationTypeValue = typeof OperationType[keyof typeof OperationType];

interface CalculationResult {
  success: boolean;
  error?: string;
  data?: any;
}

async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token) {
    return null;
  }

  const payload = verifyToken(token.value);
  return payload;
}

export async function createRootCalculation(value: number): Promise<CalculationResult> {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    if (value === undefined || value === null) {
      return { success: false, error: 'Value is required' };
    }

    const node = await prisma.calculationNode.create({
      data: {
        userId: user.userId,
        isRoot: true,
        value: parseFloat(value.toString()),
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

    revalidatePath('/task-2');
    return { success: true, data: node };
  } catch (error) {
    console.error('Error creating root calculation:', error);
    return { success: false, error: 'Failed to create calculation' };
  }
}

export async function addOperation(
  parentId: string,
  operation: OperationTypeValue,
  rightOperand: number
): Promise<CalculationResult> {
  try {
    const user = await getUserFromCookie();

    if (!user) {
      return { success: false, error: 'Authentication required' };
    }

    if (!parentId || !operation || rightOperand === undefined) {
      return { success: false, error: 'Parent ID, operation, and right operand are required' };
    }

    // Validate operation type
    if (!Object.values(OperationType).includes(operation)) {
      return { success: false, error: 'Invalid operation type' };
    }

    // Get parent node
    const parent = await prisma.calculationNode.findUnique({
      where: { id: parentId },
    });

    if (!parent) {
      return { success: false, error: 'Parent node not found' };
    }

    // Calculate result
    const leftOperand = parent.value;
    const right = parseFloat(rightOperand.toString());
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
          return { success: false, error: 'Cannot divide by zero' };
        }
        result = leftOperand / right;
        break;
      default:
        return { success: false, error: 'Invalid operation' };
    }

    const node = await prisma.calculationNode.create({
      data: {
        userId: user.userId,
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

    revalidatePath('/task-2');
    return { success: true, data: node };
  } catch (error) {
    console.error('Error adding operation:', error);
    return { success: false, error: 'Failed to add operation' };
  }
}

export async function getAllCalculations() {
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

    return calculations;
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return [];
  }
}
