import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export async function AuthLink() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const signedIn = Boolean(data?.claims)

  return (
    <Link
      href={signedIn ? '/settings' : '/auth/login'}
      className={buttonVariants({ variant: 'ghost', size: 'sm' })}
    >
      {signedIn ? '설정' : '로그인'}
    </Link>
  )
}
