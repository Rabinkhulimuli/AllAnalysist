'use client';

import { LoginUseCase } from '@/src/application/auth/LoginUseCase';
import { authRepository } from '@/src/infrastructure/auth/AuthRepository';
import { useState } from 'react';

const loginUseCase = new LoginUseCase(authRepository);

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUseCase.execute({ email, password });
      // console.log('Login successful:', user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='email' className='mb-1 block text-sm font-medium'>
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-3 py-2'
          required
        />
      </div>

      <div>
        <label htmlFor='password' className='mb-1 block text-sm font-medium'>
          Password
        </label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full rounded-md border border-gray-300 px-3 py-2'
          required
        />
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-400'
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
