import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { isProjectLead } from '@/lib/roles'
import EditProjectTabs from './EditProjectTabs'
import type { Project, ProjectMember, Volunteer, OpenRole, JoinRequest } from '@/lib/types'

export default async function EditProjectPage(props: PageProps<'/projects/[slug]/edit'>) {
  const { slug } = await props.params

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !project) notFound()

  const lead = await isProjectLead(project.id)
  if (!lead) redirect(`/projects/${slug}`)

  const supabaseAuth = await createClient()
  const [{ data: members }, { data: openRoles }, { data: joinRequests }] = await Promise.all([
    supabase.from('project_members').select('*, volunteers(*)').eq('project_id', project.id),
    supabase.from('open_roles').select('*').eq('project_id', project.id),
    supabaseAuth.from('join_requests').select('*, volunteers(*)').eq('project_id', project.id).eq('status', 'pending'),
  ])

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Project</h1>
      <EditProjectTabs
        project={project as Project}
        members={(members ?? []) as (ProjectMember & { volunteers: Volunteer })[]}
        openRoles={(openRoles ?? []) as OpenRole[]}
        joinRequests={(joinRequests ?? []) as (JoinRequest & { volunteers: Volunteer })[]}
      />
    </main>
  )
}
