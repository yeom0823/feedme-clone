import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'

import { Toaster } from '@/components/ui/sonner'
import { SaveButton } from './save-button'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }))

const saveArticle = vi.fn()
vi.mock('../actions', () => ({ saveArticle: (...a: unknown[]) => saveArticle(...a) }))

const ARTICLE = {
  url: 'https://example.com/post?a=1',
  title: '예시 글',
  author: '',
  site: 'example.com',
  markdown: '본문',
}

function Harness({ signedIn = true, initiallySaved = false }) {
  const [saved, setSaved] = useState(initiallySaved)
  return (
    <>
      <SaveButton article={ARTICLE} signedIn={signedIn} saved={saved} onSaved={() => setSaved(true)} />
      <Toaster />
    </>
  )
}

beforeEach(() => {
  push.mockReset()
  saveArticle.mockReset()
})

test('저장을 누르면 그 글을 저장하고 저장됨으로 바뀌며 토스트가 뜬다', async () => {
  saveArticle.mockResolvedValue({ ok: true })
  const user = userEvent.setup()
  render(<Harness />)

  await user.click(screen.getByRole('button', { name: '저장' }))

  expect(saveArticle).toHaveBeenCalledWith(ARTICLE)
  expect(await screen.findByRole('button', { name: '저장됨' })).toBeInTheDocument()
  expect(await screen.findByText('저장했습니다')).toBeInTheDocument()
})

test('이미 저장한 글은 저장됨으로 보이고 눌러도 아무 일도 없다', async () => {
  const user = userEvent.setup()
  render(<Harness initiallySaved />)

  await user.click(screen.getByRole('button', { name: '저장됨' }))

  expect(saveArticle).not.toHaveBeenCalled()
  expect(push).not.toHaveBeenCalled()
})

test('저장에 실패하면 버튼은 저장으로 남고 실패 토스트가 뜬다', async () => {
  saveArticle.mockResolvedValue({ ok: false })
  const user = userEvent.setup()
  render(<Harness />)

  await user.click(screen.getByRole('button', { name: '저장' }))

  expect(await screen.findByText('저장하지 못했습니다')).toBeInTheDocument()
  await waitFor(() => expect(screen.getByRole('button', { name: '저장' })).toBeEnabled())
})

test('로그아웃 상태에서 저장을 누르면 보던 글로 돌아오는 로그인 화면으로 간다', async () => {
  const user = userEvent.setup()
  render(<Harness signedIn={false} />)

  await user.click(screen.getByRole('button', { name: '저장' }))

  expect(saveArticle).not.toHaveBeenCalled()
  expect(push).toHaveBeenCalledWith(
    '/auth/login?next=%2F%3Furl%3Dhttps%253A%252F%252Fexample.com%252Fpost%253Fa%253D1&reason=save'
  )
})
