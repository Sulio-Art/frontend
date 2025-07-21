"use client";

// Step 1: Import all necessary hooks and libraries
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useRegisterUserMutation } from "@/lib/api/authApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Step 2: Define a validation schema for the hero form
const heroFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  // Make phone optional or add validation as needed
  phoneNumber: z
    .string()
    .min(10, { message: "A valid phone number is required." }),
});

export default function Hero() {
  const router = useRouter();

  // Step 3: Get user and login status from Redux
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  // Step 4: Instantiate the mutation hook and react-hook-form
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(heroFormSchema),
  });

  // Step 5: Create the submission handler
  const onRegister = async (data) => {
    // For a real registration, you'd need a password.
    // Here, we'll create a dummy one and assume the user will reset it later,
    // or you could add a password field to this form.
    const submissionData = {
      ...data,
      password: `!Default123`, // A temporary default password
    };
    try {
      await registerUser(submissionData).unwrap();
      // On success, redirect to the OTP verification page
      router.push(`/auth/verify?email=${data.email}`);
    } catch (err) {
      console.error("Hero registration failed:", err);
      // The `error` object from the hook will display the message
    }
  };

  const serverErrorMessage =
    error?.data?.message || "An unexpected error occurred.";

  return (
    <div className="min-h-screen md:px-2 snap-y snap-mandatory flex justify-evenly items-start">
      <div className="gap-16 flex flex-col lg:flex-row justify-around items-center">
        <div className="flex flex-col justify-start">
          <div className="text-left px-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Artists Using AI Assistants Have Increased Engagement by 85%.
            </h1>
            <p className="py-3 text-md md:text-xl">
              Simplify your workflow, connect with buyers and focus on creating
              art.
            </p>
            <div className="relative w-full aspect-video">
              <Image
                src="/images/section1.gif"
                alt="AI Assistant demonstration"
                fill
                priority
                className="object-cover"
                quality={100}
              />
            </div>
          </div>
        </div>
        <div className="max-w-72 md:max-w-sm space-y-2">
          <Card className="bg-white text-black max-w-72 md:max-w-sm shrink-0 shadow-2xl rounded-3xl">
            <div className="text-center -rotate-3 text-lg md:text-3xl font-extrabold flex flex-col justify-center items-center -translate-y-4 text-[#ff8c43]">
              <span className="rounded-xl px-2 py-1 w-fit bg-[#FBF2B3] font-extrabold">
                {isLoggedIn ? "WELCOME BACK!" : "SEE HOW AI"}
              </span>
              {!isLoggedIn && (
                <span className="rounded-xl px-2 py-1 w-fit bg-[#FBF2B3] font-extrabold">
                  CHATBOT WORKS
                </span>
              )}
            </div>

            {/* Step 6: Use conditional rendering based on login status */}
            {isLoggedIn ? (
              <CardContent className="space-y-4 text-center p-8">
                <h3 className="text-2xl font-bold">
                  You're all set, {user?.firstName}!
                </h3>
                <p>Ready to continue creating?</p>
                <Link href="/dashboard">
                  <Button className="w-full bg-[#ff8c43] hover:bg-[#ff8c43]/90 text-white rounded-3xl py-6 h-auto text-sm md:text-md font-semibold">
                    GO TO DASHBOARD
                  </Button>
                </Link>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit(onRegister)}>
                <CardContent className="space-y-4">
                  {/* Server error display */}
                  {error && (
                    <p className="text-red-500 text-sm text-center">
                      {serverErrorMessage}
                    </p>
                  )}

                  <div className="flex flex-row justify-center items-center gap-2">
                    <div className="relative w-full">
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="pl-10 pr-4 py-6 rounded-3xl bg-gray-100"
                        {...register("firstName")}
                      />
                      {/* ... user icon ... */}
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1 pl-2">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="relative w-full">
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="pl-10 pr-4 py-6 rounded-3xl bg-gray-100"
                        {...register("lastName")}
                      />
                      {/* ... user icon ... */}
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 pl-2">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10 pr-4 py-6 rounded-3xl bg-gray-100 w-full"
                      {...register("email")}
                    />
                    {/* ... email icon ... */}
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 pl-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="Phone"
                      className="pl-10 pr-4 py-6 rounded-3xl bg-gray-100 w-full"
                      {...register("phoneNumber")}
                    />
                    {/* ... phone icon ... */}
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1 pl-2">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#ff8c43] hover:bg-[#ff8c43]/90 text-white rounded-3xl py-6 h-auto text-sm md:text-md font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "CREATING ACCOUNT..." : "TRY FOR FREE"}
                  </Button>
                </CardContent>
              </form>
            )}
          </Card>
          <p className="leading-tight text-lg px-10 text-center">
            Start today and see upto 40% time-saving on client interations in
            the first month!
          </p>
        </div>
      </div>
    </div>
  );
}
