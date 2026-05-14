export type ProjectStatus =
  | 'active'
  | 'incubator'
  | 'seeking_volunteers'
  | 'paused'
  | 'completed'

export interface Project {
  id: string
  name: string
  slug: string
  description: string | null
  status: ProjectStatus
  contact_email: string | null
  tags: string[]
  created_at: string
}

export interface Volunteer {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  skills: string[]
  linkedin_url: string | null
  github_url: string | null
  website_url: string | null
}

export interface ProjectMember {
  id: string
  project_id: string
  volunteer_id: string
  role_title: string | null
  is_lead: boolean
  volunteers: Volunteer
}

export interface OpenRole {
  id: string
  project_id: string
  title: string
  description: string | null
}

export interface ProjectWithDetails extends Project {
  project_members: ProjectMember[]
  open_roles: OpenRole[]
}

export interface JoinRequest {
  id: string
  volunteer_id: string
  project_id: string
  status: 'pending' | 'approved' | 'rejected'
  message: string | null
  created_at: string
  volunteers?: Volunteer
}
