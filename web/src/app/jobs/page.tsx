import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import { ProjectStatus } from '@/lib/types'

type OpenRoleWithProject = {
  id: string
  title: string
  description: string | null
  projects: {
    name: string
    slug: string
    status: ProjectStatus
    tags: string[]
  }
}

export default async function JobsPage() {
  const { data: roles, error } = await supabase
    .from('open_roles')
    .select(`
      id,
      title,
      description,
      projects (
        name,
        slug,
        status,
        tags
      )
    `)
    .order('id')

  if (error) {
    return <pre className="p-8 text-red-600">Error: {error.message}</pre>
  }

  // TODO: replace manual cast with Supabase generated types (supabase gen types)
  const openRoles = (roles ?? []) as unknown as OpenRoleWithProject[]

  return (
    <>
      <div className="bg-brand-blue text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Open roles</h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Browse volunteer opportunities across all active Civic Tech DC projects.
          </p>
        </div>
      </div>
      <main className="max-w-6xl mx-auto px-6 py-12">
        {openRoles.length === 0 ? (
          <p className="text-gray-500 text-sm">No open roles right now — check back soon.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {openRoles.map((role) => (
              <Link
                key={role.id}
                href={`/projects/${role.projects.slug}`}
                className="group border-2 border-brand-gold rounded-xl p-6 bg-white hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-brand-blue text-lg group-hover:underline">
                      {role.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{role.projects.name}</p>
                  </div>
                  <StatusBadge status={role.projects.status} />
                </div>
                {role.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{role.description}</p>
                )}
                {role.projects.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {role.projects.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
