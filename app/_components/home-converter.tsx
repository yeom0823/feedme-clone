'use client'

import { useState } from 'react'

import { SaveButton } from '@/features/saved-articles/components/save-button'
import { UrlConverter } from '@/features/url-to-markdown/components/url-converter'

type Props = { initialUrl: string; signedIn: boolean; savedUrls: string[] }

/** 홈의 변환기에 저장 버튼을 붙인다. 이미 저장한 URL은 처음부터 "저장됨"으로 보인다. */
export function HomeConverter({ initialUrl, signedIn, savedUrls }: Props) {
  const [saved, setSaved] = useState(() => new Set(savedUrls))

  return (
    <UrlConverter
      initialUrl={initialUrl}
      resultActions={(page) => (
        <SaveButton
          article={page}
          signedIn={signedIn}
          saved={saved.has(page.url)}
          onSaved={() => setSaved((prev) => new Set(prev).add(page.url))}
        />
      )}
    />
  )
}
