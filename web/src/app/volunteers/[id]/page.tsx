import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import { ProjectStatus } from '@/lib/types'
import { getVolunteerForUser } from '@/lib/roles'

export default async function VolunteerPage(props: PageProps<'/volunteers/[id]'>) {
  const { id } = await props.params

  const { data: volunteer, error } = await supabase
    .from('volunteers')
    .select(`
      *,
      project_members (
        role_title,
        is_lead,
        projects (
          id,
          name,
          slug,
          status
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !volunteer) {
    notFound()
  }

  const currentVolunteer = await getVolunteerForUser()
  const isOwner = currentVolunteer?.id === id

  const projects = volunteer.project_members.map((m: {
    role_title: string | null
    is_lead: boolean
    projects: { id: string; name: string; slug: string; status: ProjectStatus }
  }) => ({
    ...m.projects,
    role_title: m.role_title,
    is_lead: m.is_lead,
  }))

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/" className="text-sm text-brand-blue hover:underline mb-8 inline-block">
        ← All Projects
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        {volunteer.avatar_url ? (
          <img
            src={volunteer.avatar_url}
            alt={volunteer.name}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium flex-shrink-0">
            {volunteer.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{volunteer.name}</h1>
            {isOwner && (
              <Link
                href={`/volunteers/${id}/edit`}
                className="text-sm text-gray-500 hover:text-brand-blue transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
          {/* Social links */}
          <div className="flex gap-4 mt-2">
            {volunteer.linkedin_url && (
              <a href={volunteer.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-800">
                LinkedIn
              </a>
            )}
            {volunteer.github_url && (
              <a href={volunteer.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-800">
                GitHub
              </a>
            )}
            {volunteer.website_url && (
              <a href={volunteer.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-800">
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {volunteer.bio && (
        <p className="text-gray-600 leading-relaxed mb-8">{volunteer.bio}</p>
      )}

      {/* Skills */}
      {volunteer.skills?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {volunteer.skills.map((skill: string) => (
              <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Projects</h2>
          <div className="flex flex-col gap-3">
            {projects.map((project: { id: string; name: string; slug: string; status: ProjectStatus; role_title: string | null; is_lead: boolean }) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="flex items-center justify-between border-2 border-brand-gold rounded-lg p-4 bg-white hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-medium text-brand-blue text-sm">{project.name}</p>
                  {project.role_title && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {project.is_lead ? `${project.role_title} · Lead` : project.role_title}
                    </p>
                  )}
                </div>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
