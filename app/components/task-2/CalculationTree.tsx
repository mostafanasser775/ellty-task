'use client';

import { useState, useEffect } from 'react';
import CalculationNode from './CalculationNode';
import { createRootCalculation, addOperation, getAllCalculations } from '../../../server actions/calculations';

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

interface CalculationTreeProps {
  user: User | null;
  initialTrees: CalculationNodeData[];
}

export default function CalculationTree({ user, initialTrees }: CalculationTreeProps) {
  const [trees, setTrees] = useState<CalculationNodeData[]>(initialTrees);
  const [showNewRootForm, setShowNewRootForm] = useState(false);
  const [newRootValue, setNewRootValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTrees = async () => {
    try {
      const data = await getAllCalculations();
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  const handleCreateRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newRootValue) return;

    setIsSubmitting(true);
    setError('');
    try {
      const result = await createRootCalculation(parseFloat(newRootValue));
      
      if (result.success) {
        setNewRootValue('');
        setShowNewRootForm(false);
        await fetchTrees();
      } else {
        setError(result.error || 'Failed to create calculation');
      }
    } catch (error) {
      console.error('Error creating root:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddOperation = async (
    parentId: string,
    operation: string,
    rightOperand: number
  ) => {
    if (!user) return;

    const result = await addOperation(
      parentId,
      operation as 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE',
      rightOperand
    );

    if (result.success) {
      await fetchTrees();
    } else {
      throw new Error(result.error || 'Failed to add operation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Calculation Trees</h2>
        {user && (
          <button
            onClick={() => setShowNewRootForm(!showNewRootForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showNewRootForm ? 'Cancel' : 'Start New Calculation'}
          </button>
        )}
      </div>

      {showNewRootForm && (
        <form
          onSubmit={handleCreateRoot}
          className="bg-white p-4 rounded-lg shadow-md border-2 border-blue-300"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Number
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="any"
              value={newRootValue}
              onChange={(e) => setNewRootValue(e.target.value)}
              placeholder="Enter a number"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
          {error && (
            <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </form>
      )}

      {trees.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No calculations yet. {user ? 'Start a new one!' : 'Login to start a calculation.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {trees.map((tree) => (
            <div key={tree.id} className="bg-gray-50 p-4 rounded-lg">
              <CalculationNode 
                node={tree} 
                currentUser={user}
                onAddOperation={handleAddOperation} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
