'use client';

import { RegisterUseCase } from '@/src/application/auth/RegisterUseCase';
import { authRepository } from '@/src/infrastructure/auth/AuthRepository';
import { useState } from 'react';

const registerUseCase = new RegisterUseCase(authRepository);

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registerUseCase.execute(formData);
      // console.log('Registration successful:', user);
      // TODO: Handle successful registration (redirect, auto-login, etc.)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='name' className='mb-1 block text-sm font-medium'>
          Name
        </label>
        <input
          id='name'
          name='name'
          type='text'
          value={formData.name}
          onChange={handleChange}
          className='w-full rounded-md border border-gray-300 px-3 py-2'
          required
        />
      </div>

      <div>
        <label htmlFor='email' className='mb-1 block text-sm font-medium'>
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
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
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          className='w-full rounded-md border border-gray-300 px-3 py-2'
          required
        />
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-md bg-green-600 py-2 text-white disabled:bg-gray-400'
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
