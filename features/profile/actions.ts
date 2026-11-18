'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export type ProfileFormState = { ok: boolean; message: string }

export async function updateDisplayName(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub
  if (!userId) {
    return { ok: false, message: '로그인이 필요합니다' }
  }

  const displayName = String(formData.get('display_name') ?? '').trim()
  if (displayName.length > 50) {
    return { ok: false, message: '이름은 50자 이하로 입력하세요' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName || null })
    .eq('id', userId)
  if (error) {
    return { ok: false, message: '저장하지 못했습니다' }
  }

  revalidatePath('/settings')
  return { ok: true, message: '저장했습니다' }
}
