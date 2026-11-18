import type { createClient } from '@/lib/supabase/server'

type Supabase = Awaited<ReturnType<typeof createClient>>

export type SavedArticle = {
  id: string
  url: string
  title: string
  author: string
  site: string
  markdown: string
  saved_at: string
}

/** 로그인한 사용자가 저장한 URL 목록. RLS가 본인 것만 돌려준다. */
export async function listSavedUrls(supabase: Supabase): Promise<string[]> {
  const { data } = await supabase.from('saved_articles').select('url')
  return (data ?? []).map((row) => row.url as string)
}

/** 최근 저장한 순. */
export async function listSavedArticles(supabase: Supabase) {
  const { data } = await supabase
    .from('saved_articles')
    .select('id, title, site, saved_at')
    .order('saved_at', { ascending: false })
  return (data ?? []) as Pick<SavedArticle, 'id' | 'title' | 'site' | 'saved_at'>[]
}

/** 없는 글, 다른 사용자의 글, 형식이 틀린 id는 모두 null이다. */
export async function getSavedArticle(supabase: Supabase, id: string) {
  const { data, error } = await supabase
    .from('saved_articles')
    .select('id, url, title, author, site, markdown, saved_at')
    .eq('id', id)
    .maybeSingle()
  return error ? null : (data as SavedArticle | null)
}
