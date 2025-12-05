'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function VerifyForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Redirect if not logged in (though server page should handle this too, double safety)
  if (!user) {
    router.push('/login')
    return null
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file) return setMessage('파일을 선택해 주세요.')
    setUploading(true)
    setMessage(null)

    const filePath = `${user.id}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('submissions')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setMessage(`업로드 실패: ${uploadError.message}`)
      setUploading(false)
      return
    }

    // record in DB (client-side insert)
    const { error: insertError } = await supabase
      .from('verifications')
      .insert({ user_id: user.id, file_path: filePath, bucket: 'submissions', status: 'pending' })
      .select()

    if (insertError) {
      console.error('Insert error details:', insertError)
      setMessage(
        `DB 저장 실패: ${insertError.message || JSON.stringify(insertError)}`
      )
      setUploading(false)
      return
    }

    setMessage('업로드 성공: 검토 후 알림톡이 발송됩니다.')
    setFile(null)
    setPreview(null)
    setUploading(false)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">건강검진/백신 인증</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          검사 결과 또는 접종 확인서를 촬영하여 업로드해주세요.<br/>
          담당자 검토 후 리워드가 지급됩니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Input Area */}
        <div className="relative group">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileChange}
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full h-64 
              border-2 border-dashed rounded-xl cursor-pointer transition-all
              ${preview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
            `}
          >
            {preview ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image src={preview} alt="preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full">이미지 변경하기</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">클릭하여 업로드</span></p>
                <p className="text-xs text-gray-400">PNG, JPG (최대 10MB)</p>
              </div>
            )}
          </label>
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium text-center ${message.includes('실패') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <button
          onClick={upload}
          disabled={uploading || !file}
          className={`
            w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform
            ${uploading || !file 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'}
          `}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              업로드 중...
            </span>
          ) : '인증 제출하기'}
        </button>
      </div>
    </div>
  )
}
