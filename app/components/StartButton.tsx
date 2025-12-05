'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent } from 'react'

export default function StartButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()

  const handleClick = (e: MouseEvent) => {
    if (!isLoggedIn) return // Link will handle navigation

    e.preventDefault()
    // Smooth scroll to the how-it-works section and focus the heading
    const el = document.getElementById('how-it-works')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // try to focus the first focusable element inside (or the heading)
      const heading = el.querySelector('h2, h1') as HTMLElement | null
      if (heading) heading.focus()
    } else {
      // Fallback: navigate to home route fragment
      router.push('#how-it-works')
    }
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95 flex items-center justify-center"
      >
        1분 만에 시작하기
      </Link>
    )
  }

  return (
    <a
      href="#how-it-works"
      onClick={handleClick}
      className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95 flex items-center justify-center"
    >
      1분 만에 시작하기
    </a>
  )
}
