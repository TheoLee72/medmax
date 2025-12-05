import Link from "next/link";
import HeaderAuth from "./HeaderAuth";
import { User } from "@supabase/supabase-js";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          MedMax
        </Link>
        <HeaderAuth user={user} />
      </div>
    </header>
  );
}
