'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

/** 저장 시점의 변환 결과. 프롬프트는 저장하지 않는다. */
export type ArticleSnapshot = {
  url: string
  title: string
  author: string
  site: string
  markdown: string
}

export type ActionResult = { ok: boolean }

const UNIQUE_VIOLATION = '23505'

export async function saveArticle(article: ArticleSnapshot): Promise<ActionResult> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return { ok: false }

  const { error } = await supabase.from('saved_articles').insert({
    user_id: data.claims.sub,
    url: String(article.url),
    title: String(article.title),
    author: String(article.author ?? ''),
    site: String(article.site ?? ''),
    markdown: String(article.markdown),
  })
  // 같은 URL을 이미 저장했다면 목록에는 그대로 하나만 남는다.
  if (error && error.code !== UNIQUE_VIOLATION) return { ok: false }

  revalidatePath('/saved')
  return { ok: true }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_articles')
    .delete()
    .eq('id', id)
    .select('id')
  if (error || !data?.length) return { ok: false }

  revalidatePath('/saved')
  return { ok: true }
}
