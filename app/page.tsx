import Link from "next/link";
import { Code2, Calculator, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Ellty Test Assignment
            </h1>
            <p className="text-xl text-gray-600">
              Full Stack Developer Assessment Projects
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Code2 size={16} />
              <span>Built with Next.js, TypeScript, React & Prisma</span>
            </div>
          </div>

          {/* Task Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Task 1 */}
            <Link href="/task-1" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Code2 className="text-blue-600" size={32} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Task 1
                </h2>
           
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    React
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    Next.js
                  </span>
                </div>
              </div>
            </Link>

            {/* Task 2 */}
            <Link href="/task-2" className="group">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Calculator className="text-purple-600" size={32} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Task 2: Calculation Tree Network
                </h2>
             
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    Full Stack
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    Authentication
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    Prisma
                  </span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                    SQLite
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    User Registration & Login
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Create Calculation Trees
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Add Operations (+, -, ×, ÷)
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Nested Tree Visualization
                  </div>
                </div>
              </div>
            </Link>
          </div>

      
        </div>
      </main>
    </div>
  );
}
