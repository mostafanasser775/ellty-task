'use client';

import { useState } from 'react';
import { Plus, Minus, X, Divide } from 'lucide-react';

interface User {
  id: string;
  username: string;
}

interface CalculationNodeData {
  id: string;
  userId: string;
  user: User;
  isRoot: boolean;
  value: number;
  operation: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE' | null;
  rightOperand: number | null;
  parentId: string | null;
  children?: CalculationNodeData[];
  createdAt: string | Date;
}

interface CalculationNodeProps {
  node: CalculationNodeData;
  currentUser: User | null;
  onAddOperation: (parentId: string, operation: string, rightOperand: number) => Promise<void>;
}

const operationSymbols = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '×',
  DIVIDE: '÷',
};

const operationIcons = {
  ADD: Plus,
  SUBTRACT: Minus,
  MULTIPLY: X,
  DIVIDE: Divide,
};

export default function CalculationNode({ node, currentUser, onAddOperation }: CalculationNodeProps) {
  const [showForm, setShowForm] = useState(false);
  const [operation, setOperation] = useState<'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'>('ADD');
  const [rightOperand, setRightOperand] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightOperand) return;

    setIsSubmitting(true);
    try {
      await onAddOperation(node.id, operation, parseFloat(rightOperand));
      setRightOperand('');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding operation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ml-6 my-2">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-1 bg-gray-300 h-full absolute left-0 top-0"></div>
        
        <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              by <span className="font-medium">{node.user.username}</span>
            </div>
          </div>

          {node.isRoot ? (
            <div className="text-2xl font-bold text-blue-600">
              {node.value}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                {node.operation && operationSymbols[node.operation]} {node.rightOperand}
              </div>
              <div className="text-2xl font-bold text-green-600">
                = {node.value}
              </div>
            </div>
          )}

          {currentUser && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              {showForm ? 'Cancel' : 'Add Operation'}
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t pt-2">
              <div className="flex gap-1">
                {(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'] as const).map((op) => {
                  const Icon = operationIcons[op];
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setOperation(op)}
                      className={`p-2 rounded ${
                        operation === op
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={op}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>

              <input
                type="number"
                step="any"
                value={rightOperand}
                onChange={(e) => setRightOperand(e.target.value)}
                placeholder="Enter number"
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                required
                disabled={isSubmitting}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </form>
          )}
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="ml-4 border-l-2 border-gray-300 pl-2">
          {node.children.map((child) => (
            <CalculationNode
              key={child.id}
              node={child}
              currentUser={currentUser}
              onAddOperation={onAddOperation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
