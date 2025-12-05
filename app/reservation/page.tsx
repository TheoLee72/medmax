'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const HOSPITALS = [
  { name: '속엔사랑연합내과의원', url: 'https://map.naver.com/p/search/속엔사랑연합내과의원' },
  { name: '신기한속내과연합의원', url: 'https://map.naver.com/p/search/신기한속내과연합의원' },
  { name: '김은진산부인과의원', url: 'https://map.naver.com/p/search/김은진산부인과의원' },
]

export default function ReservationPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleNext = () => {
    const newErrors: { name?: string; phone?: string } = {}
    let hasError = false

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.'
      hasError = true
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.'
      hasError = true
    } else {
      const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
      const cleanPhone = formData.phone.replace(/-/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = '올바른 전화번호 형식을 입력해주세요.'
        hasError = true
      }
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    setStep(2)
  }

  const handleReservation = async (hospital: { name: string, url: string }) => {
    if (loading) return
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('로그인이 필요합니다.')
        router.push('/login')
        return
      }

      const { error } = await supabase.from('reservations').insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        hospital_name: hospital.name
      })

      if (error) throw error

      // Redirect to Naver Map
      window.open(hospital.url, '_blank')
      router.push('/') // Go back to home or show success message
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('예약 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    let formatted = rawValue
    if (rawValue.length > 3 && rawValue.length <= 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`
    } else if (rawValue.length > 7) {
      formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`
    }
    setFormData(prev => ({ ...prev, phone: formatted }))
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-6">
      {step === 1 ? (
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              아래 정보를 입력해주세요
            </h1>
            <p className="text-sm text-gray-500">
              이름과 전화번호는 예약 확인을 위해서만 사용됩니다.
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-xl font-medium text-gray-900 block">이름</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full border-b-2 py-2 text-lg focus:outline-none transition-colors bg-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-200 focus:border-blue-600'
                }`}
                placeholder="홍길동"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xl font-medium text-gray-900 block">전화번호</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={13}
                className={`w-full border-b-2 py-2 text-lg focus:outline-none transition-colors bg-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-blue-600'
                }`}
                placeholder="010-1234-5678"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            다음으로
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              현재는 아래 병원에서만<br/>가능합니다
            </h1>
          </div>

          <div className="space-y-4">
            {HOSPITALS.map((hospital) => (
              <button
                key={hospital.name}
                onClick={() => handleReservation(hospital)}
                disabled={loading}
                className="w-full bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-6 text-left transition-all group relative overflow-hidden"
              >
                <div className="relative z-10 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700">
                    {hospital.name}
                  </span>
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setStep(1)}
            className="text-gray-400 text-sm underline decoration-gray-300 underline-offset-4 hover:text-gray-600"
          >
            이전 단계로
          </button>
        </div>
      )}
    </div>
  )
}
