import { LoginForm } from '@/features/auth/components/login-form'

const NOTICES: Record<string, string> = {
  save: '글을 저장하려면 로그인이 필요합니다. 로그인하면 보던 글로 돌아갑니다.',
}

export default async function Page({ searchParams }: PageProps<'/auth/login'>) {
  const { reason } = await searchParams
  const notice = typeof reason === 'string' ? NOTICES[reason] : undefined
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm notice={notice} />
      </div>
    </div>
  )
}
