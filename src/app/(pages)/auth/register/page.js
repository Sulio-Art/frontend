// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   useRegisterUserMutation,
//   useVerifyOtpMutation,
// } from "@/lib/api/authApi";
// import { Toaster, toast } from "react-hot-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";

// const registerSchema = z.object({
//   firstName: z.string().min(2, "First name is required"),
//   lastName: z.string().min(2, "Last name is required"),
//   email: z.string().email("Invalid email address"),
//   phoneNumber: z.string().min(10, "A valid phone number is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// const otpSchema = z.object({
//   otp: z.string().min(6, "OTP must be 6 digits"),
// });

// export default function RegisterPage() {
//   const router = useRouter();
//   const [showOtpForm, setShowOtpForm] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");

//   const [registerUser, { isLoading: isRegistering }] =
//     useRegisterUserMutation();
//   const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

//   const {
//     register: registerForm,
//     handleSubmit: handleRegisterSubmit, 
//     formState: { errors: registerErrors },
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const {
//     register: registerOtp,
//     handleSubmit: handleOtpSubmit,
//     formState: { errors: otpErrors },
//   } = useForm({
//     resolver: zodResolver(otpSchema),
//   });

 
//   const onRegisterSubmit = async (data) => {
//     try {
//       await registerUser(data).unwrap();
//       setRegisteredEmail(data.email);
//       setShowOtpForm(true);
//       toast.success("Registration successful! Please verify your OTP.");
//     } catch (err) {
//       toast.error(err.data?.message || "Registration failed.");
//     }
//   };

  
//   const onOtpSubmit = (data) => {
//     console.log("DEV MODE: Bypassing OTP step for:", registeredEmail);
//     toast.success("Account created! Redirecting to login.");
//     router.replace(
//       `/auth/login?verified=true&email=${encodeURIComponent(registeredEmail)}`
//     );
//   };

//   return (
//     <>
//       <Toaster position="top-center" />
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Card className="w-full max-w-md p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold">
//               {showOtpForm ? "Verify Your Account" : "Create an Account"}
//             </h1>
//             <p className="text-gray-600">
//               {showOtpForm
//                 ? `We've sent a code to ${registeredEmail}`
//                 : "Get started with your new account"}
//             </p>
//           </div>

//           {!showOtpForm ? (
            
//             <form
//               onSubmit={handleRegisterSubmit(onRegisterSubmit)}
//               className="space-y-4"
//               noValidate
//             >
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input id="firstName" {...registerForm("firstName")} />
//                   {registerErrors.firstName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {registerErrors.firstName.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input id="lastName" {...registerForm("lastName")} />
//                   {registerErrors.lastName && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {registerErrors.lastName.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" {...registerForm("email")} />
//                 {registerErrors.email && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {registerErrors.email.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="phoneNumber">Phone Number</Label>
//                 <Input
//                   id="phoneNumber"
//                   type="tel"
//                   {...registerForm("phoneNumber")}
//                 />
//                 {registerErrors.phoneNumber && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {registerErrors.phoneNumber.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   {...registerForm("password")}
//                 />
//                 {registerErrors.password && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {registerErrors.password.message}
//                   </p>
//                 )}
//               </div>
//               <Button type="submit" className="w-full" disabled={isRegistering}>
//                 {isRegistering ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}{" "}
//                 {isRegistering ? "Creating..." : "Create Account"}
//               </Button>
//             </form>
//           ) : (
            
//             <form
//               onSubmit={handleOtpSubmit(onOtpSubmit)}
//               className="space-y-4"
//               noValidate
//             >
//               <div>
//                 <Label htmlFor="otp">Verification Code</Label>
//                 <Input
//                   id="otp"
//                   {...registerOtp("otp")}
//                   placeholder="Enter any 6 digits"
//                 />
//                 {otpErrors.otp && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {otpErrors.otp.message}
//                   </p>
//                 )}
//               </div>
//               <Button type="submit" className="w-full" disabled={isVerifying}>
//                 {isVerifying ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}{" "}
//                 {isVerifying ? "Verifying..." : "Verify Email"}
//               </Button>
//             </form>
//           )}

//           <div className="mt-6 text-center">
//             <p className="text-sm">
//               Already have an account?{" "}
//               <Link
//                 href="/auth/login"
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// }




// pages/auth/register.js










"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Read the backend URL from the client-accessible environment variable
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "A valid phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm({ resolver: zodResolver(otpSchema) });

  const onRegisterSubmit = async (data) => {
    setIsRegistering(true);
    try {
      // We now call your external backend API directly for registration
      const response = await fetch(`${BACKEND_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setRegisteredEmail(data.email);
      setShowOtpForm(true);
      toast.success("Registration successful! Please verify your OTP.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const onOtpSubmit = (data) => {
    // This function would also call your backend's OTP verification endpoint
    setIsVerifying(true);
    toast.success("Account verified! Redirecting to login.");
    router.replace(`/auth/login?verified=true`);
    setIsVerifying(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              {showOtpForm ? "Verify Your Account" : "Create an Account"}
            </h1>
            <p className="text-gray-600">
              {showOtpForm
                ? `We've sent a code to ${registeredEmail}`
                : "Get started with your new account"}
            </p>
          </div>

          {!showOtpForm ? (
            <form
              onSubmit={handleRegisterSubmit(onRegisterSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...registerForm("firstName")} />
                  {registerErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...registerForm("lastName")} />
                  {registerErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerErrors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...registerForm("email")} />
                {registerErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerErrors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" type="tel" {...registerForm("phoneNumber")} />
                {registerErrors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerErrors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...registerForm("password")} />
                {registerErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerErrors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                {isRegistering ? "Creating..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input id="otp" {...registerOtp("otp")} placeholder="Enter any 6 digits" />
                {otpErrors.otp && (
                  <p className="text-red-500 text-sm mt-1">{otpErrors.otp.message}</p>

                )}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}