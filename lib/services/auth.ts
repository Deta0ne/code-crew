'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { SignInInput, SignUpInput, OTPVerificationInput, otpVerificationSchema, resendOtpSchema } from '@/lib/validations/auth'
import { signInSchema, signUpSchema } from '@/lib/validations/auth'
import slugify from 'slugify';
import { OAuthUserMetadata } from '@/types/auth';

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

  const { data,error } = await supabase.auth.verifyOtp({
    email: formData.email,
    token: formData.token,
    type: 'signup'
  })

  if (error) {
    console.error('OTP Verification Error:', error)
    return { success: false, error: error.message }
  }

  if (!data.user) {
    return { success: false, error: 'User not found after verification.' };
  }

  const profileResult = await createOrUpdateUserProfile({
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.full_name,
    username: data.user.user_metadata?.username,
    picture: undefined, 
    github_url: undefined,
}, 'manual');

if (profileResult.error) {
  console.error('Profile Creation Error after OTP:', profileResult.error);
  return { success: false, error: `Your account was verified, but we failed to create your profile. Please contact support. Error: ${profileResult.error}` };
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

export async function signInWithGitHub() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      scopes: 'read:user user:email'
    }
  })

  if (error) {
    console.error('GitHub Sign-In Initiation Error:', error)
    return { error: error.message }
  }

  return { 
    url: data.url, 
    error: null 
  }
}

export async function createOrUpdateUserProfile(user: OAuthUserMetadata, type: 'manual' | 'oauth') {
  const supabase = await createClient();

  const { data: existingProfile, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error fetching user profile:', selectError);
    return { error: selectError.message };
  }

  if (existingProfile) {
    const updateData = {
      avatar_url: user.picture || '',
      github_url: user.github_url || '',
    };

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile Update Error:', updateError);
      return { error: updateError.message };
    }

    return { error: null };
  }
  
  else {
    let finalUsername: string;

    if (type === 'manual') {
      finalUsername = user.username!.toLowerCase().trim().slice(0, 50);

    } else {
      const nameSource = user.username || user.name || 'user';
      const baseUsername = slugify(nameSource.replace(/\./g, '-'), {
        replacement: '_',
        strict: true,
        locale: 'tr',
        trim: true
      });
      const uniqueSuffix = Date.now().toString().slice(-6);
      finalUsername = `${baseUsername}_${uniqueSuffix}`.slice(0, 50);
    }

    const insertData = {
      id: user.id,
      username: finalUsername,
      full_name: user.name || '',
      avatar_url: user.picture || '',
      github_url: user.github_url || '',
    };

    const { error: insertError } = await supabase
      .from('users')
      .insert(insertData);

    if (insertError) {
      console.error('Profile Creation Error:', insertError);
      return { error: insertError.message };
    }

    return { error: null };
  }
}