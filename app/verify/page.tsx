'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function VerifyPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async () => {
    if (!file || !accountNumber) return
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // 1. Upload file
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Insert record
      const { error: dbError } = await supabase.from('verifications').insert({
        user_id: user.id,
        file_path: fileName,
        account_number: accountNumber,
        status: 'pending'
      })

      if (dbError) throw dbError

      setStep(4)
    } catch (error) {
      console.error('Error submitting verification:', error)
      alert('제출 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-12 px-6">
      
      {/* Step 1: Intro */}
      {step === 1 && (
        <div className="w-full max-w-md flex flex-col h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex-1 pt-12">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight whitespace-pre-wrap">
              MedMax에서<br/>예약한 경우만<br/>포인트 지급이<br/>가능합니다
            </h1>
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            확인했습니다
          </button>
        </div>
      )}

      {/* Step 2: Image Upload */}
      {step === 2 && (
        <div className="w-full max-w-md flex flex-col h-[80vh] animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              건강검진 결과 서류를<br/>업로드 해주세요
            </h1>
          </div>

          <div className="flex-1 flex gap-4 mb-8">
            {/* Left: Example */}
            <div className="flex-1 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-center border border-gray-200 relative overflow-hidden">
              <Image 
                src="/health-check-example.jpg" 
                alt="Example" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-2">
                <p className="text-sm font-bold">예시 이미지</p>
                <p className="text-xs mt-1 opacity-90">주민번호 뒷자리는<br/>가려주세요</p>
              </div>
            </div>

            {/* Right: Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 rounded-2xl flex flex-col items-center justify-center p-4 text-center border-2 border-dashed cursor-pointer transition-all overflow-hidden relative ${
                previewUrl ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="w-12 h-12 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-blue-600 font-bold">사진 올리기</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <button
            onClick={() => file ? setStep(3) : alert('사진을 업로드해주세요.')}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              file 
                ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      )}

      {/* Step 3: Account Info */}
      {step === 3 && (
        <div className="w-full max-w-md flex flex-col h-[80vh] animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 mb-12">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              계좌번호를<br/>입력해주세요
            </h1>
            <p className="text-sm text-gray-500 italic">
              계좌번호는 포인트 지급 목적으로만 사용됩니다
            </p>
          </div>

          <div className="flex-1">
            <label className="text-xl font-medium text-gray-900 block mb-2">계좌번호</label>
            <input 
              type="text" 
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border-b-2 border-gray-200 py-2 text-lg focus:outline-none focus:border-blue-600 transition-colors bg-transparent"
              placeholder="은행명 계좌번호 입력"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
              accountNumber && !loading
                ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? '제출 중...' : '제출하기'}
          </button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="w-full max-w-md flex flex-col h-[80vh] animate-in fade-in zoom-in duration-500 justify-center items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
            검토 후<br/>빠른 시일 내에<br/>연락드리겠습니다
          </h1>
          <p className="text-gray-500 mb-12">
            제출해주셔서 감사합니다.
          </p>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
