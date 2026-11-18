import { notFound, redirect } from 'next/navigation'

import { DeleteArticleButton } from '@/features/saved-articles/components/delete-article-button'
import { SavedDate } from '@/features/saved-articles/components/saved-date'
import { getSavedArticle } from '@/features/saved-articles/queries'
import { ArticleResult } from '@/features/url-to-markdown/components/article-result'
import { createClient } from '@/lib/supabase/server'
import { BackLink } from '../../_components/back-link'
import { PageShell } from '../../_components/page-shell'

export default async function SavedArticlePage({ params }: PageProps<'/saved/[id]'>) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect(`/auth/login?next=${encodeURIComponent(`/saved/${id}`)}`)

  // 다른 사용자의 글은 RLS가 돌려주지 않으므로 없는 글과 같이 처리된다.
  const article = await getSavedArticle(supabase, id)
  if (!article) notFound()

  const { title, author, site, url, markdown } = article
  return (
    <PageShell signedIn>
      <BackLink href="/saved">저장한 글</BackLink>
      <ArticleResult
        page={{ title, author, site, url, markdown }}
        actions={<DeleteArticleButton id={article.id} />}
        meta={
          <span className="text-xs text-muted-foreground">
            <SavedDate value={article.saved_at} suffix=" 저장" />
          </span>
        }
      />
    </PageShell>
  )
}
