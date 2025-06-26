"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onRegisterSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.register(data);
      setRegisteredEmail(data.email);
      setShowOtpForm(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.verifyOtp({
        email: registeredEmail,
        otp: data.otp,
      });
      router.replace('/auth/login?verified=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            {showOtpForm ? 'Verify Your Email' : 'Create an Account'}
          </h1>
          <p className="text-gray-600">
            {showOtpForm
              ? 'Enter the verification code sent to your email'
              : 'Please fill in your details'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {!showOtpForm ? (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...registerForm('firstName')}
                  className={registerErrors.firstName ? 'border-red-500' : ''}
                />
                {registerErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{registerErrors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...registerForm('lastName')}
                  className={registerErrors.lastName ? 'border-red-500' : ''}
                />
                {registerErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{registerErrors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...registerForm('email')}
                className={registerErrors.email ? 'border-red-500' : ''}
              />
              {registerErrors.email && (
                <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...registerForm('phoneNumber')}
                className={registerErrors.phoneNumber ? 'border-red-500' : ''}
              />
              {registerErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{registerErrors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...registerForm('password')}
                className={registerErrors.password ? 'border-red-500' : ''}
              />
              {registerErrors.password && (
                <p className="text-red-500 text-sm mt-1">{registerErrors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerForm('confirmPassword')}
                className={registerErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {registerErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                {...registerOtp('otp')}
                placeholder="Enter 6-digit code"
                className={otpErrors.otp ? 'border-red-500' : ''}
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}