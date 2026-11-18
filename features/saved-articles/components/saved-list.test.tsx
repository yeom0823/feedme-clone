import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { SavedList } from './saved-list'

test('저장한 글이 없으면 안내와 홈으로 가는 버튼을 보여 준다', () => {
  render(<SavedList articles={[]} />)

  expect(screen.getByText('아직 저장한 글이 없습니다')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: '글 변환하러 가기' })).toHaveAttribute('href', '/')
})

test('각 항목은 제목과 사이트명 · 저장일을 보여 주고 저장한 글 보기로 이어진다', () => {
  render(
    <SavedList
      articles={[
        { id: 'a1', title: '첫 글', site: 'Supabase Blog', saved_at: '2026-11-17T03:00:00Z' },
        { id: 'a2', title: '둘째 글', site: 'velog', saved_at: '2026-10-30T03:00:00Z' },
      ]}
    />
  )

  const links = screen.getAllByRole('link')
  expect(links.map((l) => l.getAttribute('href'))).toEqual(['/saved/a1', '/saved/a2'])
  expect(links[0]).toHaveTextContent('첫 글')
  expect(links[0]).toHaveTextContent(/Supabase Blog · \d{4}년 \d{1,2}월 \d{1,2}일/)
})
