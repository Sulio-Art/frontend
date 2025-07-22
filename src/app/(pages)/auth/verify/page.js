"use client";


import { useVerifyOtpMutation } from "@/lib/api/authApi";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
  });

  const [verifyOtp, { isLoading, isSuccess, error }] = useVerifyOtpMutation();

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [searchParams, setValue]);

  async function onSubmit(data) {
    try {
      await verifyOtp(data).unwrap();
    } catch (err) {
      console.error("Failed to verify OTP:", err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push("/auth/login?verified=true");
      }, 2000);
    }
  }, [isSuccess, router]);

  const errorMessage =
    error?.data?.message || "Verification failed. Please try again.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Verify Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded border bg-gray-100 px-3 py-2 text-black"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              {...register("otp", { required: "OTP is required" })}
              className={`mt-1 w-full rounded border px-3 py-2 text-black${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="one-time-code"
              inputMode="numeric"
              disabled={isLoading || isSuccess}
            />
            {errors.otp && (
              <span className="text-xs text-red-600">{errors.otp.message}</span>
            )}
          </div>

          {error && (
            <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {isSuccess && (
            <div className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
              Verification successful! Redirecting to login...
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Didn&apos;t receive the code?{" "}
          <Link
            href="/auth/request-password-reset"
            className="text-blue-600 hover:underline"
          >
            Request new one
          </Link>
        </div>
      </div>
    </div>
  );
}