import { redirect } from 'next/navigation'

import { SavedList } from '@/features/saved-articles/components/saved-list'
import { listSavedArticles } from '@/features/saved-articles/queries'
import { createClient } from '@/lib/supabase/server'
import { BackLink } from '../_components/back-link'
import { PageShell } from '../_components/page-shell'

export default async function SavedPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/auth/login?next=/saved')

  const articles = await listSavedArticles(supabase)

  return (
    <PageShell signedIn>
      <BackLink href="/">FEED-ME로 돌아가기</BackLink>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">저장한 글</h1>
        {articles.length > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            {articles.length}개 · 최근 저장한 순
          </p>
        )}
      </div>
      <SavedList articles={articles} />
    </PageShell>
  )
}
