import Link from 'next/link'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/features/url-to-markdown/components/theme-toggle'

/** 홈·저장한 글·저장한 글 보기가 함께 쓰는 폭, 여백, 헤더. */
export function PageShell({
  signedIn,
  children,
  footer,
}: {
  signedIn: boolean
  children: ReactNode
  footer?: ReactNode
}) {
  const link = buttonVariants({ variant: 'ghost', size: 'sm' })
  return (
    <div className="mx-auto flex w-full max-w-190 flex-1 flex-col gap-5 px-4 pt-3">
      <header className="flex items-center justify-end gap-1">
        {signedIn ? (
          <>
            <Link href="/saved" className={link}>
              저장한 글
            </Link>
            <Link href="/settings" className={link}>
              설정
            </Link>
          </>
        ) : (
          <Link href="/auth/login" className={link}>
            로그인
          </Link>
        )}
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col gap-5">{children}</main>
      {footer}
    </div>
  )
}
