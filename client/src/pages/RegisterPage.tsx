import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../shared/validators/auth.validator';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type RegisterFormValues = z.input<typeof registerSchema>;

const roleOptions = [
  { value: 'sales', label: 'Sales User' },
  { value: 'admin', label: 'Admin' },
];

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data as z.output<typeof registerSchema>);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const msg = error instanceof AxiosError
        ? error.response?.data?.message || 'Registration failed'
        : 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Create your account</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Start managing leads with SmartLeads</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password')} />
            <Select label="Role" options={roleOptions} error={errors.role?.message} {...register('role')} />
            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Create Account</Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
