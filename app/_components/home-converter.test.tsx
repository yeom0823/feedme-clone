import { render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { HomeConverter } from './home-converter'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }))
vi.mock('@/features/saved-articles/actions', () => ({ saveArticle: vi.fn() }))

const PAGE = {
  title: '예시 글',
  author: '',
  site: 'example.com',
  url: 'https://example.com/post',
  markdown: '본문입니다.',
}

function stubApi(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })))
}

afterEach(() => vi.unstubAllGlobals())

test('변환 결과가 보이면 결과 머리에 저장 버튼이 복사하기 왼쪽에 있다', async () => {
  stubApi(200, PAGE)
  render(<HomeConverter initialUrl={PAGE.url} signedIn savedUrls={[]} />)

  await screen.findByRole('heading', { name: '예시 글' })
  const save = screen.getByRole('button', { name: '저장' })
  const copy = screen.getByRole('button', { name: '복사하기' })
  expect(save.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('이미 저장한 URL은 처음부터 저장됨으로 보인다', async () => {
  stubApi(200, PAGE)
  render(<HomeConverter initialUrl={PAGE.url} signedIn savedUrls={[PAGE.url]} />)

  await screen.findByRole('heading', { name: '예시 글' })
  expect(screen.getByRole('button', { name: '저장됨' })).toBeInTheDocument()
})

test.each([
  { label: '가져오기 실패', status: 502, body: { error: 'fetch' }, message: '페이지를 가져오지 못했습니다' },
  { label: '본문 없음', status: 422, body: { error: 'empty' }, message: '본문을 찾지 못했습니다' },
])('$label 상태에서는 저장 버튼이 없다', async ({ status, body, message }) => {
  stubApi(status, body)
  render(<HomeConverter initialUrl={PAGE.url} signedIn savedUrls={[]} />)

  await screen.findByText(message)
  expect(screen.queryByRole('button', { name: '저장' })).not.toBeInTheDocument()
})

test('변환 중에는 저장 버튼이 없다', () => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
  render(<HomeConverter initialUrl={PAGE.url} signedIn savedUrls={[]} />)

  expect(screen.queryByRole('button', { name: '저장' })).not.toBeInTheDocument()
})
