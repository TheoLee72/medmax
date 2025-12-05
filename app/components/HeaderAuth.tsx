'use client'

import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function HeaderAuth({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/profile" 
          className="text-sm text-gray-700 inline hover:text-blue-600 font-medium transition-colors"
        >
          {user.email?.split('@')[0]}님
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
    >
      로그인
    </Link>
  )
}
