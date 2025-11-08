'use client';

import { LogOut, User as UserIcon } from 'lucide-react';
import { logoutAction } from '../../../server actions/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
}

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Calculation Tree Network
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              A world where people communicate through numbers
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon size={20} />
                <span className="font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
