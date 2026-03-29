import { LucideCamera } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { ServerSelector } from "../components/ServerSelector";
import { LoginButton } from "../components/LoginButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-gray-900">
      <div className="z-10 max-w-7xl w-full flex flex-col gap-12 mt-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200">
            <LucideCamera className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
            Photobot Dashboard
          </h1>
          <p className="text-xl max-w-2xl text-gray-600">
            Empowering photography communities with AI-driven mentorship, trivia, and automated critiques.
          </p>
          
          {!session && (
            <div className="flex gap-4 mt-4">
              <LoginButton />
            </div>
          )}
        </div>

        {session && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <h2 className="text-3xl font-bold text-gray-800">Your Servers</h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Logged in as</p>
                  <p className="font-bold text-gray-900">{session.user?.name || session.user?.email}</p>
                </div>
                {session.user?.image && (
                  <img src={session.user.image} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
            </div>
            <ServerSelector />
          </div>
        )}
      </div>
    </main>
  );
}
