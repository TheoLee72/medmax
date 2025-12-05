'use client'

import { createClient } from '@/utils/supabase/client'

export default function LandingPage() {
  const supabase = createClient()

  const handleKakaoLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
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
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-6 py-12 relative overflow-hidden">
      
      {/* Main Text Content */}
      <div className="flex flex-col items-center text-center w-full max-w-md mt-32 space-y-6 z-10">
        <span className="text-blue-600 font-bold tracking-wider text-sm bg-blue-100/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
          MedMax Rewards
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 tracking-tight">
          건강검진하고<br />
          <span className="text-blue-600">5만원</span> 받아가세요
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          복잡한 절차 없이<br/>
          인증만 하면 바로 지급됩니다.
        </p>
      </div>

      {/* Decorative Elements - 은은한 배경 효과 */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] -z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-[80px] -z-0 pointer-events-none" />

      {/* Login Button Area */}
      <div className="w-full max-w-md mb-8 z-10">
        <button
          onClick={handleKakaoLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#E6CF00] text-black rounded-2xl py-4 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12 3C5.925 3 1 6.925 1 11.775c0 2.9 1.75 5.475 4.5 7.025-.2 1.325-.725 2.4-1.65 3.125 1.675.125 3.625-.5 5.1-1.525.675.1 1.375.15 2.05.15 6.075 0 11-3.925 11-8.775S18.075 3 12 3z"/>
          </svg>
          <span className="text-lg font-bold">카카오로 3초 만에 시작하기</span>
        </button>
        <p className="text-center text-xs text-gray-400 mt-5">
          로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
