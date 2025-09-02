'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { SignInInput, SignUpInput, OTPVerificationInput, otpVerificationSchema, resendOtpSchema } from '@/lib/validations/auth'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'

type GoogleUserMetadata = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function login(formData: SignInInput) {
  const parsedData = signInSchema.safeParse(formData)
  if (!parsedData.success) {
    return { error: 'Invalid input' }
  }
  const supabase = await createClient()

  const data = {
    email: formData.email,
    password: formData.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { error: error.message }
  }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: SignUpInput) {
  const parsedData = signUpSchema.safeParse(formData)
  if (!parsedData.success) {
    return { error: 'Invalid input' }
  }
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        username: formData.username,
        full_name: formData.fullName,
      }
    }
  })

  if (error) {
    console.error('Signup Error:', error.message)
    return { error: error.message }
  }

  return { error: null }
}

export async function verifyOTP(formData: OTPVerificationInput) {
  const parsedData = otpVerificationSchema.safeParse(formData)
  if (!parsedData.success) {
    return { error: 'Invalid input' }
  }
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email: formData.email,
    token: formData.token,
    type: 'signup'
  })

  if (error) {
    console.error('OTP Verification Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resendOTP(email: string) {
  const parsedData = resendOtpSchema.safeParse({ email })
  if (!parsedData.success) {
    return { error: 'Invalid input' }
  }
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  })

  if (error) {
    console.error('Resend OTP Error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      scopes: 'openid email profile'
    }
  })

  if (error) {
    console.error('Google Sign-In Initiation Error:', error)
    return { error: error.message }
  }

  return { 
    url: data.url, 
    error: null 
  }
}

export async function createOrUpdateUserProfile(user: GoogleUserMetadata) {
  const supabase = await createClient()

  const username = user.name 
    ? user.name.toLowerCase().replace(/\s+/g, '_').slice(0, 50)
    : user.email.split('@')[0]

  const { error } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      username: username,
      full_name: user.name || '',
      avatar_url: user.picture || '',
    }, {
      onConflict: 'id'
    })

  if (error) {
    console.error('Profile Creation/Update Error:', error)
    return { error: error.message }
  }

  return { error: null }
}