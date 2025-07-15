"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      const from = searchParams.get("from") || "/dashboard";

      router.replace(from);
    }
  }, [user, router, searchParams]);

  const onSubmit = async (data) => {
    try {
      const userData = await loginUser(data).unwrap();

      dispatch(setCredentials(userData));
    } catch (err) {
      toast.error(err.data?.message || "Invalid credentials.");
      console.error("Failed to login:", err);
    }
  };

  // Show a toast message if coming from verification page
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Account verified! Please log in.");
    }
  }, [searchParams]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600">Please sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-center">
              {error.data?.message || "An unexpected error occurred."}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/request-password-reset"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot your password?
            </Link>
            <div className="text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
