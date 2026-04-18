import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isProjectLead } from '@/lib/roles'
import EditProjectForm from './EditProjectForm'
import TeamManager from './TeamManager'
import type { Project, ProjectMember, Volunteer } from '@/lib/types'

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

  const { data: members } = await supabase
    .from('project_members')
    .select('*, volunteers(*)')
    .eq('project_id', project.id)

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
    </main>
  )
}
