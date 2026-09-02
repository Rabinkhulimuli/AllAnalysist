import { LoginForm } from '@/src/presentation/features/homepage/components/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Login - Clean Architecture Template',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Login</h1>
          <p className="text-gray-600 text-center mb-6">
            Sign in to your account to continue
          </p>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Link
              href="/"
              className="text-center block text-gray-600 hover:text-gray-900 text-sm"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
