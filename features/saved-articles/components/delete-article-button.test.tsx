import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'

import { Toaster } from '@/components/ui/sonner'
import { DeleteArticleButton } from './delete-article-button'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }))

const deleteArticle = vi.fn()
vi.mock('../actions', () => ({ deleteArticle: (...a: unknown[]) => deleteArticle(...a) }))

beforeEach(() => {
  push.mockReset()
  deleteArticle.mockReset()
})

function setup() {
  const user = userEvent.setup()
  render(
    <>
      <DeleteArticleButton id="a1" />
      <Toaster />
    </>
  )
  return user
}

test('삭제를 누르면 되돌릴 수 없다는 확인 창이 뜨고, 취소하면 아무것도 바뀌지 않는다', async () => {
  const user = setup()

  await user.click(screen.getByRole('button', { name: '삭제' }))

  const dialog = await screen.findByRole('alertdialog')
  expect(dialog).toHaveTextContent('이 글을 삭제할까요?')
  expect(dialog).toHaveTextContent('되돌릴 수 없습니다')
  expect(dialog).toHaveTextContent('원문 페이지는 그대로')

  await user.click(within(dialog).getByRole('button', { name: '취소' }))

  await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  expect(deleteArticle).not.toHaveBeenCalled()
  expect(push).not.toHaveBeenCalled()
})

test('확인 창에서 삭제하면 그 글을 지우고 목록으로 돌아가며 토스트가 뜬다', async () => {
  deleteArticle.mockResolvedValue({ ok: true })
  const user = setup()

  await user.click(screen.getByRole('button', { name: '삭제' }))
  const dialog = await screen.findByRole('alertdialog')
  await user.click(within(dialog).getByRole('button', { name: '삭제' }))

  expect(deleteArticle).toHaveBeenCalledWith('a1')
  await waitFor(() => expect(push).toHaveBeenCalledWith('/saved'))
  expect(await screen.findByText('삭제했습니다')).toBeInTheDocument()
})
