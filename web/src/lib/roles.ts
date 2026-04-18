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

export async function isProjectLead(projectId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('project_members')
    .select('id, volunteers!inner(auth_user_id)')
    .eq('project_id', projectId)
    .eq('is_lead', true)
    .eq('volunteers.auth_user_id', user.id)
    .single()

  return !!data
}

export async function getVolunteerForUser(): Promise<{ id: string; name: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('volunteers')
    .select('id, name')
    .eq('auth_user_id', user.id)
    .single()

  return data ?? null
}
