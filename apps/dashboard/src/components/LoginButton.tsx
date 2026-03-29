"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("discord")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all hover:scale-105"
    >
      Login with Discord
    </button>
  );
}
