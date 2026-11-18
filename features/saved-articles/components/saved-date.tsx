'use client'

import { useSyncExternalStore } from 'react'

import { formatSavedDate } from '../lib/format-saved-date'

const subscribe = () => () => {}

/** 저장일을 사용자 브라우저 시간대로 보여 준다. 서버 렌더에서는 비워 둔다. */
export function SavedDate({ value, suffix = '' }: { value: string; suffix?: string }) {
  const inBrowser = useSyncExternalStore(subscribe, () => true, () => false)
  return (
    <time dateTime={value}>{inBrowser ? `${formatSavedDate(value)}${suffix}` : null}</time>
  )
}
