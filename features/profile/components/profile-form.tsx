'use client'

import { useActionState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateDisplayName, type ProfileFormState } from '@/features/profile/actions'
import { cn } from '@/lib/utils'

const initialState: ProfileFormState = { ok: true, message: '' }

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayName, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="display_name">표시 이름</Label>
        <Input id="display_name" name="display_name" defaultValue={displayName} maxLength={50} />
      </div>
      {state.message && (
        <p
          aria-live="polite"
          className={cn('text-sm', state.ok ? 'text-muted-foreground' : 'text-destructive')}
        >
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? '저장 중...' : '저장'}
      </Button>
    </form>
  )
}
