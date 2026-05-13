# Civic Volunteer Platform — Project Vision

## Overview

A standalone web platform for a civic tech non-profit that serves as a central hub for all active and past projects. The primary goals are:

1. Help new volunteers discover projects and understand what skills are needed
2. Give current volunteers a place to organize their work and showcase their contributions
3. Legitimize volunteer work publicly — useful for portfolios, resumes, and employer visibility
4. Grow over time from a simple project directory into a full volunteer job board

---

## The Problem

The organization currently has projects scattered across a website, GitHub, and informal channels (meetups, Slack, etc.). There is no single place to see:
- All projects (including incubator-stage ones not yet on the main site)
- Who is working on them and in what capacity
- What skills or roles each project still needs
- The status or health of a project

New volunteers have no easy way to find where they can help. Existing volunteers have no way to show off their work.

---

## Target Audience

**Primary:**
- **New volunteers** — looking for a project to join, want to understand what skills are needed and who to contact
- **Current volunteers** — want their work visible, organized, and credited

**Secondary:**
- **The general public and employers** — can browse the site to understand what the org does and see the talent involved
- **City partners and stakeholders** — can see what projects exist and their status

---

## Core Concepts

### Projects
Each project has its own page with:
- Name and description
- Status (see below)
- List of open roles / skills needed
- Team members with their roles
- Contact button to reach the project admin (MVP)

**Project Statuses:**
| Status | Meaning |
|---|---|
| `Active` | Currently being worked on |
| `Incubator` | Early stage, team forming |
| `Seeking Volunteers` | Active but needs more people |
| `Paused` | On hold |
| `Completed` | Shipped or wrapped up |

### People
Each person has a profile card on their project(s) showing:
- Name
- Role on the project
- (Optional) Avatar/photo

Each person also has a dedicated profile page with:
- Bio / short description
- Skills
- Links (LinkedIn, GitHub, personal site)
- All projects they are or have been part of

### Roles
There is a distinction between:
- **Project Lead** — primary point of contact, has admin-level control over the project page
- **Contributor** — general team member

---

## Key Features by Phase

### Phase 1 — MVP: Project Directory
The goal here is to get something working quickly that organizes existing projects and teams, even if all data is admin-managed.

- [x] Projects listing page — browse all projects with status badge and tags
- [x] Individual project page — description, status, team, open roles
- [x] Basic filtering — by status and by skill/technology tag
- [x] Team member tiles — name, role, optional photo
- [x] Individual volunteer profile page
- [x] Admin-managed content — no self-service yet, data is entered/updated by an admin

> **Decision:** Dropped per-project contact buttons as the Civic Tech DC website already points to an existing Slack group and is the most common form of communication. A proper join request flow will come in Phase 2.

### Phase 2 — Self-Service: Accounts & Profiles
- [x] GitHub OAuth sign-in
- [x] Per-project lead roles — leads can only manage their own project, not others
- [x] Project leads can create projects (granted via `can_create_project` flag)
- [x] Project leads can edit their project page
- [x] Project leads can manage their project's team roster and open roles
- [x] Volunteers self-manage their own profiles
- [ ] Open registration — auto-create a volunteer record on first GitHub sign-in (#2)
- [ ] Volunteers can request to join a project (lead approves/rejects) (#3)
- [ ] Notifications for join requests — email, in-app, or Slack TBD (#4)

### Phase 3 — Volunteer Job Board
- [ ] Skills matching — surface relevant projects to a volunteer based on their profile
- [ ] Project "open roles" work like job listings volunteers can apply to
- [ ] Potential expansion to paid contract opportunities
- [ ] Public-facing showcase with shareable project and profile URLs

---

## Discovery & Filtering

On the main projects page, visitors can filter/search by:
- **Status** — e.g., only show "Seeking Volunteers"
- **Skills/Technologies needed** — e.g., "show me projects that need Python devs"
- **Free-text search** — by project name or description

---

## Out of Scope (for now)
- Deep integration with the existing org website (it will simply link to this platform)
- Categories or topic areas for projects
- Real-time collaboration features
- Payments or contractor management

---

## Design & Branding
- Standalone site, separate from the existing org website
- The org website may link to this platform
- Branding should loosely follow the org's existing look and feel, but flexibility is acceptable
- Clean, professional, and accessible — this is a public-facing portfolio for volunteers

---

## Open Questions
- How should the invite flow work? Email invite link? Admin creates the account?
- Should past/completed projects still be fully browsable, or tucked into an archive?
- Will the platform eventually need multilingual support?
