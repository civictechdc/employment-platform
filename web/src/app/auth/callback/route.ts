import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: existing } = await supabase
        .from('volunteers')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (!existing) {
        const username = user.user_metadata?.user_name as string | undefined
        const { data: created } = await supabase
          .from('volunteers')
          .insert({
            auth_user_id: user.id,
            name: (user.user_metadata?.full_name as string | undefined) ?? username ?? 'New Volunteer',
            avatar_url: user.user_metadata?.avatar_url as string | undefined,
            github_url: username ? `https://github.com/${username}` : undefined,
          })
          .select('id')
          .single()

        if (created) {
          return NextResponse.redirect(`${origin}/volunteers/${created.id}`)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
