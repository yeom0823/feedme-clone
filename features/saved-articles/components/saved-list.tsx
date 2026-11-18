import Link from 'next/link'
import { BookmarkIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SavedDate } from './saved-date'

export type SavedArticleSummary = { id: string; title: string; site: string; saved_at: string }

export function SavedList({ articles }: { articles: SavedArticleSummary[] }) {
  if (!articles.length) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookmarkIcon />
          </EmptyMedia>
          <EmptyTitle>아직 저장한 글이 없습니다</EmptyTitle>
          <EmptyDescription>
            변환한 글의 결과 위에서 &lsquo;저장&rsquo;을 누르면 여기에 모입니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            글 변환하러 가기
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col border-t">
      {articles.map((article) => (
        <li key={article.id} className="border-b">
          <Link
            href={`/saved/${article.id}`}
            className="flex flex-col gap-1 px-1 py-3.5 outline-none hover:bg-muted/50 focus-visible:bg-muted/50"
          >
            <span className="text-base leading-snug font-semibold break-keep wrap-anywhere">
              {article.title}
            </span>
            <span className="text-[13px] text-muted-foreground">
              {article.site} · <SavedDate value={article.saved_at} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
