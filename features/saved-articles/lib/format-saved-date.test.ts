import { expect, test } from 'vitest'

import { formatSavedDate } from './format-saved-date'

test('저장일은 YYYY년 M월 D일 형식으로 보인다', () => {
  expect(formatSavedDate('2026-11-17T03:00:00Z', 'Asia/Seoul')).toBe('2026년 11월 17일')
})

test('저장일은 주어진 시간대의 날짜를 따른다', () => {
  // UTC 11월 17일 20시는 서울에서는 11월 18일 새벽이다.
  expect(formatSavedDate('2026-11-17T20:00:00Z', 'Asia/Seoul')).toBe('2026년 11월 18일')
  expect(formatSavedDate('2026-11-17T20:00:00Z', 'UTC')).toBe('2026년 11월 17일')
})
