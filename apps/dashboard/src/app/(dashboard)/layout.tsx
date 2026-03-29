import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminGuilds } from "@/lib/discord";
import { ServerSelector } from "@/components/server-selector";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect("/");
  }

  const adminGuilds = await getAdminGuilds(session.accessToken as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-blue-600">Photobot</Link>
            <nav className="flex gap-4">
              <Link href="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</Link>
              <Link href="/audit" className="text-sm font-medium text-gray-600 hover:text-gray-900">Audit Log</Link>
            </nav>
          </div>
          <ServerSelector guilds={adminGuilds} />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
