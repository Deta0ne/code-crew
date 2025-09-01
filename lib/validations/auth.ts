// src/lib/validations/auth.ts
import { z } from 'zod'

// Email + Password Registration Schema
export const signUpSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .refine((val) => !val.startsWith('_') && !val.startsWith('-'), 'Username cannot start with underscore or hyphen'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Full name can only contain letters and spaces'),
})

// Email + Password Login Schema
export const signInSchema = z.object({
  email: z.email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
})

// OTP Verification Schema
export const otpVerificationSchema = z.object({
    email: z.email('Please enter a valid email address'),
  token: z.string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
})

// Resend OTP Schema
export const resendOtpSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

// Profile Update Schema (for after registration)
export const profileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  githubUrl: z.url()
    .optional()
    .or(z.literal('')),
  linkedinUrl: z.url()
    .optional()
    .or(z.literal('')),
  portfolioUrl: z.url()
    .optional()
    .or(z.literal('')),
  primaryRoleId: z.number()
    .int('Please select a role')
    .positive('Please select a role'),
  location: z.string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableForProjects: z.boolean(),
})

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type OTPVerificationInput = z.infer<typeof otpVerificationSchema>
export type ResendOTPInput = z.infer<typeof resendOtpSchema>
export type ProfileInput = z.infer<typeof profileSchema>