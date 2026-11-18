'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteArticle } from '../actions'

export function DeleteArticleButton({ id }: { id: string }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function remove() {
    setPending(true)
    const result = await deleteArticle(id).catch(() => ({ ok: false }))
    if (result.ok) {
      router.push('/saved')
      toast.success('삭제했습니다')
    } else {
      setPending(false)
      toast.error('삭제하지 못했습니다', { description: '잠시 후 다시 시도해 주세요.' })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" className="text-destructive hover:text-destructive" />}
      >
        <Trash2Icon />
        삭제
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>이 글을 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            저장한 글 목록에서 사라지고 되돌릴 수 없습니다. 원문 페이지는 그대로 남아 있습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
