"use client";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("/assets/loginbackground.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center mb-6">
          <img
            src="/assets/logouibblue.webp"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Universitas Internasional Batam. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}