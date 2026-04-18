import { redirect } from 'next/navigation'
import { canCreateProject } from '@/lib/roles'
import CreateProjectForm from './CreateProjectForm'

export default async function NewProjectPage() {
  const allowed = await canCreateProject()
  if (!allowed) redirect('/')

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Project</h1>
      <CreateProjectForm />
    </main>
  )
}
