import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createOrUpdateUserProfile } from '@/app/(auth)/login/actions'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  const supabase = await createClient()
  
  // Exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Session Exchange Error:', error)
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  // Ensure we have a user
  if (!data.user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Create or update user profile
  const profileResult = await createOrUpdateUserProfile({
    id: data.user.id,
    email: data.user.email || '',
    name: data.user.user_metadata?.name,
    picture: data.user.user_metadata?.picture,
  })

  if (profileResult.error) {
    console.error('Profile Creation Error:', profileResult.error)
    return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
