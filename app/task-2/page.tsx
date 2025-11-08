import { getCurrentUser } from '../../server actions/auth';
import { getAllCalculations } from '../../server actions/calculations';
import AuthForm from '../components/task-2/AuthForm';
import CalculationTree from '../components/task-2/CalculationTree';
import Header from '../components/task-2/Header';

export default async function Task2Page() {
  const user = await getCurrentUser();
  const calculations = await getAllCalculations();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!user ? (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to the Calculation Tree Network
              </h2>
              <p className="text-gray-600 max-w-2xl">
                View all calculation trees below, or login/register to start your own
                calculations and respond to others.
              </p>
            </div>
            <AuthForm />
            <div className="w-full mt-8">
              <CalculationTree user={user} initialTrees={calculations} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Start a new calculation by choosing a starting number</li>
                <li>Add operations (+, -, ×, ÷) to any number in the tree</li>
                <li>Each operation creates a new branch in the calculation tree</li>
                <li>Build complex calculation chains with other users!</li>
              </ul>
            </div>
            <CalculationTree user={user} initialTrees={calculations} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>Task 2: Calculation Tree Network</p>
            <p className="mt-1">Built with Next.js, TypeScript, React, Prisma, and SQLite</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
