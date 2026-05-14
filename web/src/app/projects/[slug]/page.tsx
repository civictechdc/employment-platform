import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'
import { ProjectWithDetails } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import { isProjectLead, getVolunteerForUser } from '@/lib/roles'
import JoinRequestButton from './JoinRequestButton'

export default async function ProjectPage(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params

  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members (
        id,
        role_title,
        is_lead,
        volunteers (
          id,
          name,
          avatar_url
        )
      ),
      open_roles (
        id,
        title,
        description
      )
    `)
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  const p = project as ProjectWithDetails
  const [lead, volunteer] = await Promise.all([isProjectLead(p.id), getVolunteerForUser()])
  const leads = p.project_members.filter((m) => m.is_lead)
  const contributors = p.project_members.filter((m) => !m.is_lead)

  const isAlreadyMember = volunteer
    ? p.project_members.some((m) => m.volunteers.id === volunteer.id)
    : false

  let hasPendingRequest = false
  if (volunteer && !isAlreadyMember) {
    const supabaseAuth = await createClient()
    const { data } = await supabaseAuth
      .from('join_requests')
      .select('id')
      .eq('volunteer_id', volunteer.id)
      .eq('project_id', p.id)
      .eq('status', 'pending')
      .maybeSingle()
    hasPendingRequest = !!data
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/" className="text-sm text-brand-blue hover:underline mb-8 inline-block">
        ← All Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
        <div className="flex items-center gap-3">
          <StatusBadge status={p.status} />
          {lead && (
            <Link
              href={`/projects/${p.slug}/edit`}
              className="text-sm text-gray-500 hover:text-brand-blue transition-colors"
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {p.description && (
        <p className="text-gray-600 leading-relaxed mb-8">{p.description}</p>
      )}

      {/* Tags */}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {p.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Team */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {leads.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Project Lead{leads.length > 1 ? 's' : ''}
              </h2>
              <div className="flex flex-col gap-3">
                {leads.map((m) => (
                  <MemberTile key={m.id} member={m} />
                ))}
              </div>
            </section>
          )}

          {contributors.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Team
              </h2>
              <div className="flex flex-col gap-3">
                {contributors.map((m) => (
                  <MemberTile key={m.id} member={m} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Open Roles */}
          {p.open_roles.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Open Roles
              </h2>
              <div className="flex flex-col gap-3">
                {p.open_roles.map((role) => (
                  <div key={role.id} className="border border-gray-100 rounded-lg p-4 bg-white">
                    <p className="font-medium text-gray-900 text-sm">{role.title}</p>
                    {role.description && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{role.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Join request */}
          {volunteer && !isAlreadyMember && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Get Involved
              </h2>
              <JoinRequestButton
                projectId={p.id}
                volunteerId={volunteer.id}
                hasPendingRequest={hasPendingRequest}
              />
            </section>
          )}

        </div>
      </div>
    </main>
  )
}

function MemberTile({ member }: { member: ProjectWithDetails['project_members'][number] }) {
  const v = member.volunteers
  return (
    <Link href={`/volunteers/${v.id}`} className="flex items-center gap-3 group w-fit">
      {v.avatar_url ? (
        <img src={v.avatar_url} alt={v.name} className="w-9 h-9 rounded-full object-cover" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
          {v.name.charAt(0)}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-brand-blue group-hover:underline">{v.name}</p>
        {member.role_title && (
          <p className="text-xs text-gray-500">{member.role_title}</p>
        )}
      </div>
    </Link>
  )
}
