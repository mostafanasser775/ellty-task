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
