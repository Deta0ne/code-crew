'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { SignInInput, SignUpInput, OTPVerificationInput, otpVerificationSchema, resendOtpSchema } from '@/lib/validations/auth'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'


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