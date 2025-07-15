"use client";


import { useResetPasswordMutation } from '@/lib/api/authApi';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
      mode: 'onBlur',
  });

  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [searchParams, setValue]);
 
  async function onSubmit(data) {
   
    const { confirmPassword, ...submissionData } = data;
    try {
      await resetPassword(submissionData).unwrap();
    } catch (err) {
      console.error("Failed to reset password:", err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 2500); 
    }
  }, [isSuccess, router]);


  const errorMessage = error?.data?.message || 'Network error. Please try again.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded border bg-gray-100 px-3 py-2"
              readOnly 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              {...register("otp", { required: "OTP is required" })}
              className={`mt-1 w-full rounded border px-3 py-2 ${errors.otp ? "border-red-500" : "border-gray-300"}`}
              autoComplete="one-time-code"
              inputMode="numeric"
              disabled={isLoading || isSuccess}
            />
            {errors.otp && <span className="text-xs text-red-600">{errors.otp.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className={`mt-1 w-full rounded border px-3 py-2 ${errors.newPassword ? "border-red-500" : "border-gray-300"}`}
              autoComplete="new-password"
              disabled={isLoading || isSuccess}
            />
            {errors.newPassword && <span className="text-xs text-red-600">{errors.newPassword.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) => value === watch("newPassword") || "Passwords do not match",
              })}
              className={`mt-1 w-full rounded border px-3 py-2 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              autoComplete="new-password"
              disabled={isLoading || isSuccess}
            />
            {errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword.message}</span>}
          </div>
          
          {error && (
            <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
          )}
          {isSuccess && (
            <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              Password reset successful! Redirecting to login...
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}