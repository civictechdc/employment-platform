import { createClient } from '@/lib/supabase/server'

export async function canCreateProject(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('volunteers')
    .select('can_create_project')
    .eq('auth_user_id', user.id)
    .single()

  return data?.can_create_project ?? false
}
