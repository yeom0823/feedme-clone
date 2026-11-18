import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) {
    redirect('/auth/login?next=/settings')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', data.claims.sub)
    .maybeSingle()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-4 p-6 md:p-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← FEED-ME로 돌아가기
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">설정</CardTitle>
          <CardDescription>{data.claims.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm displayName={profile?.display_name ?? ''} />
        </CardContent>
      </Card>
      <LogoutButton />
    </div>
  )
}
