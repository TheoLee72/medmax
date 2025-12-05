import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-50 font-sans">
      {/* Header */}
      <Header user={user} />

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-8 space-y-6">
        
        {/* Card 1: Reservation */}
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-blue-100/50 border border-blue-50 relative overflow-hidden group transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              건강검진하고<br />
              <span className="text-blue-600">5만원 받아가기</span>
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              대구광역시 일부 병원 한정
            </p>
            
            <Link 
              href="/reservation" 
              className="inline-flex items-center text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              건강검진 예약하기
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Card 2: Verification */}
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden group transition-all hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
              건강검진 인증
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              건강검진을 완료했다는<br/>
              서류와 계좌번호를 알려주세요
            </p>
            
            <Link 
              href="/verify" 
              className="inline-flex items-center text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              서류 제출하기
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Notice Section */}
        <div className="pt-4 px-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">안내사항</h3>
          <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
            <li>건강검진 완료 후 30일 이내 서류를 제출해주세요</li>
            <li>MedMax에서 예약한 경우에만 가능합니다</li>
          </ul>
        </div>

      </main>
    </div>
  );
}
