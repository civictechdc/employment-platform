'use client'

import { useState } from 'react'
import Link from 'next/link'
import EditProjectForm from './EditProjectForm'
import TeamManager from './TeamManager'
import OpenRolesManager from './OpenRolesManager'
import JoinRequestsManager from './JoinRequestsManager'
import type { Project, ProjectMember, Volunteer, OpenRole, JoinRequest } from '@/lib/types'

type Tab = 'details' | 'team' | 'roles' | 'requests'

const TABS: { id: Tab; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'team', label: 'Team' },
  { id: 'roles', label: 'Open Roles' },
  { id: 'requests', label: 'Requests' },
]

interface EditProjectTabsProps {
  project: Project
  members: (ProjectMember & { volunteers: Volunteer })[]
  openRoles: OpenRole[]
  joinRequests: (JoinRequest & { volunteers: Volunteer })[]
}

export default function EditProjectTabs({ project, members, openRoles, joinRequests }: EditProjectTabsProps) {
  const [active, setActive] = useState<Tab>('details')
  const pendingCount = joinRequests.length

  return (
    <div>
      <Link
        href={`/projects/${project.slug}`}
        className="inline-block text-sm text-brand-blue hover:underline mb-6"
      >
        ← Back to project
      </Link>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-8 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              active === tab.id
                ? 'text-brand-blue border-b-2 border-brand-blue -mb-px'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
            {tab.id === 'requests' && pendingCount > 0 && (
              <span className="ml-1.5 bg-brand-blue text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === 'details' && <EditProjectForm project={project} />}
      {active === 'team' && <TeamManager projectId={project.id} initialMembers={members} />}
      {active === 'roles' && <OpenRolesManager projectId={project.id} initialRoles={openRoles} />}
      {active === 'requests' && (
        <JoinRequestsManager projectId={project.id} initialRequests={joinRequests} />
      )}
    </div>
  )
}
