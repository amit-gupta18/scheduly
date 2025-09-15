"use client";

import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Scheduler</h1>
      <p className="text-lg text-gray-600 mb-8">
        Book and manage your meetings with ease.
      </p>
      <button
        onClick={() => signIn("google")}
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </main>
  );
}
