import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { isProjectLead } from '@/lib/roles'
import EditProjectForm from './EditProjectForm'
import TeamManager from './TeamManager'
import OpenRolesManager from './OpenRolesManager'
import JoinRequestsManager from './JoinRequestsManager'
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
      <EditProjectForm project={project as Project} />
      <hr className="my-10 border-gray-200" />
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Team</h2>
      <TeamManager
        projectId={project.id}
        initialMembers={(members ?? []) as (ProjectMember & { volunteers: Volunteer })[]}
      />
      <hr className="my-10 border-gray-200" />
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Open Roles</h2>
      <OpenRolesManager
        projectId={project.id}
        initialRoles={(openRoles ?? []) as OpenRole[]}
      />
      <hr className="my-10 border-gray-200" />
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Join Requests</h2>
      <JoinRequestsManager
        projectId={project.id}
        initialRequests={(joinRequests ?? []) as (JoinRequest & { volunteers: Volunteer })[]}
      />
    </main>
  )
}
