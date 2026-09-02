import { RegisterForm } from '@/src/presentation/features/homepage/components/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Register - Clean Architecture Template',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-6">
            Join us and get started today
          </p>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Login here
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
