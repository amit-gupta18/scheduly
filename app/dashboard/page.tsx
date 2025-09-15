"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;
  if (!session) return <p className="text-center mt-20">Not signed in</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Hello, {session.user?.name}</h1>
      <p className="mt-2 text-gray-600">Email: {session.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Sign Out
      </button>
    </main>
  );
}
