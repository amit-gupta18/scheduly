"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import AuthButton from "@/components/ui/AuthButton";

export default function SignInPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div>
        <h1>Welcome, {session.user?.name}</h1>
        <p>Role: {(session.user as any).role}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign in</h1>
      <AuthButton />
    </div>
  );
}
