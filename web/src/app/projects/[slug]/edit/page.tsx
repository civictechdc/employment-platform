import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isProjectLead } from '@/lib/roles'
import EditProjectForm from './EditProjectForm'
import type { Project } from '@/lib/types'

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

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Project</h1>
      <EditProjectForm project={project as Project} />
    </main>
  )
}
