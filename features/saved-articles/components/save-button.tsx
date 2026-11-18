'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookmarkIcon, CheckIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { saveArticle, type ArticleSnapshot } from '../actions'

type Props = {
  article: ArticleSnapshot
  signedIn: boolean
  saved: boolean
  onSaved: () => void
}

/** 로그인 뒤 같은 URL로 홈에 돌아와 다시 변환되도록 하는 로그인 주소 */
function loginHref(url: string) {
  const next = `/?url=${encodeURIComponent(url)}`
  return `/auth/login?next=${encodeURIComponent(next)}&reason=save`
}

export function SaveButton({ article, signedIn, saved, onSaved }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function save() {
    if (saved || pending) return
    if (!signedIn) {
      router.push(loginHref(article.url))
      return
    }
    setPending(true)
    const result = await saveArticle(article).catch(() => ({ ok: false }))
    setPending(false)
    if (result.ok) {
      onSaved()
      toast.success('저장했습니다', { description: '저장한 글에서 다시 볼 수 있습니다.' })
    } else {
      toast.error('저장하지 못했습니다', { description: '잠시 후 다시 시도해 주세요.' })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={saved}
      disabled={pending}
      className={saved ? 'text-muted-foreground hover:text-muted-foreground' : undefined}
      onClick={save}
    >
      {saved ? <CheckIcon /> : <BookmarkIcon />}
      {saved ? '저장됨' : '저장'}
    </Button>
  )
}
