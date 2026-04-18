import { notFound, redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getVolunteerForUser } from '@/lib/roles'
import EditProfileForm from './EditProfileForm'
import type { Volunteer } from '@/lib/types'

export default async function EditProfilePage(props: PageProps<'/volunteers/[id]/edit'>) {
  const { id } = await props.params

  const currentVolunteer = await getVolunteerForUser()
  if (!currentVolunteer || currentVolunteer.id !== id) redirect(`/volunteers/${id}`)

  const { data: volunteer, error } = await supabase
    .from('volunteers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !volunteer) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h1>
      <EditProfileForm volunteer={volunteer as Volunteer} />
    </main>
  )
}
