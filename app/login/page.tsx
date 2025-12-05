'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleKakaoLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error logging in with Kakao:', error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">
            서비스 이용을 위해 로그인해주세요
          </p>
        </div>
        
        <button
          onClick={handleKakaoLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] text-[#000000] rounded-md hover:bg-[#E6CF00] transition-colors font-medium text-[15px]"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 3C5.925 3 1 6.925 1 11.775c0 2.9 1.75 5.475 4.5 7.025-.2 1.325-.725 2.4-1.65 3.125 1.675.125 3.625-.5 5.1-1.525.675.1 1.375.15 2.05.15 6.075 0 11-3.925 11-8.775S18.075 3 12 3z"/>
          </svg>
          카카오 로그인
        </button>
      </div>
    </div>
  )
}
