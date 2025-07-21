"use client";

import { useRequestPasswordResetMutation } from "@/lib/api/authApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RequestPasswordResetPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    mode: "onBlur",
  });

  const [requestPasswordReset, { isLoading, isSuccess, error }] =
    useRequestPasswordResetMutation();

  async function onSubmit(data) {
    try {
      await requestPasswordReset(data).unwrap();
    } catch (err) {
      console.error("Failed to request password reset:", err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      const email = getValues("email");
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    }
  }, [isSuccess, router, getValues]);

  const errorMessage =
    error?.data?.message || "Network error. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Request Password Reset
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 w-full rounded border px-3 py-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="email"
              disabled={isLoading || isSuccess}
            />
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          {error && (
            <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {isSuccess && (
            <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              OTP sent to your email. Redirecting...
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Requesting..." : "Request Reset"}
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