import { createClient } from "@/utils/supabase/server";
import Header from "../components/Header";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: verifications } = await supabase
    .from("verifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Generate signed URLs for private bucket access (Batch optimization)
  const { data: signedUrls } = await supabase.storage
    .from('submissions')
    .createSignedUrls((verifications || []).map(v => v.file_path), 3600);

  const verificationsWithUrls = (verifications || []).map((item) => {
    const signed = signedUrls?.find(s => s.path === item.file_path);
    return {
      ...item,
      imageUrl: signed?.signedUrl,
    };
  });

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">승인됨</span>;
      case 'fail':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">거절됨</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">검토중</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Header user={user} />

      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        {/* Profile Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl text-blue-600 font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.email?.split('@')[0]}님</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </section>

        {/* Verifications List */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">나의 인증 내역</h2>
          
          <div className="space-y-3">
            {verificationsWithUrls && verificationsWithUrls.length > 0 ? (
              verificationsWithUrls.map((item) => {
                 if (!item.imageUrl) return null;
                 
                 return (
                  <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center transition-transform hover:scale-[1.01]">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image 
                        src={item.imageUrl} 
                        alt="Verification" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        건강검진/접종 인증
                      </p>
                    </div>
                  </div>
                 )
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                <p className="text-gray-500 mb-4">아직 인증 내역이 없습니다.</p>
                <Link href="/verify" className="text-blue-600 font-bold text-sm hover:underline">
                  첫 인증하러 가기 &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
