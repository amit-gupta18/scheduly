"use client";

import { useSession } from "next-auth/react";


export default function Dashboard() {
    const { data: session } = useSession();

    if (!session) return <p>Please sign in first</p>;

    return (
        <div>
            <h1>Welcome, {session.user?.name}</h1>
            <p>Your role: {(session.user as any).role}</p>
        </div>
    );
}
