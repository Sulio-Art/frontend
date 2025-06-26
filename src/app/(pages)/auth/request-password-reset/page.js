"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestPasswordResetPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function onSubmit(data) {
    setServerError("");
    setSuccess(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || result.message || "Request failed.");
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 1500);
    } catch (err) {
      setServerError("Network error. Please try again.");
    }
  }

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
            />
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          {serverError && (
            <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          )}
          {success && (
            <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              OTP sent to your email. Redirecting...
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Requesting..." : "Request Reset"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}