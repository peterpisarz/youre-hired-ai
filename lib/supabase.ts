import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// JSONB field type definitions
export interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  location?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: string
  location?: string
}

export interface Skill {
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category?: string
}

export interface Certification {
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate?: string
  url?: string
  githubUrl?: string
}

// Database types (will be generated from Supabase CLI)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          provider: 'google' | 'linkedin' | 'email'
          provider_id: string | null
          subscription_tier: 'free' | 'basic' | 'premium'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          provider?: 'google' | 'linkedin' | 'email'
          provider_id?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          provider?: 'google' | 'linkedin' | 'email'
          provider_id?: string | null
          subscription_tier?: 'free' | 'basic' | 'premium'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          address: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          professional_summary: string | null
          work_experience: WorkExperience[] // JSONB
          education: Education[] // JSONB
          skills: Skill[] // JSONB
          certifications: Certification[] // JSONB
          projects: Project[] // JSONB
          uploaded_resume_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          address?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          work_experience?: WorkExperience[]
          education?: Education[]
          skills?: Skill[]
          certifications?: Certification[]
          projects?: Project[]
          uploaded_resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          address?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          professional_summary?: string | null
          work_experience?: WorkExperience[]
          education?: Education[]
          skills?: Skill[]
          certifications?: Certification[]
          projects?: Project[]
          uploaded_resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          job_description: string
          company_name: string | null
          position_title: string | null
          generated_content: string
          model_used: 'gpt-3.5-turbo' | 'gpt-4'
          tokens_used: number
          pdf_url: string | null
          is_favorited: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          job_description: string
          company_name?: string | null
          position_title?: string | null
          generated_content: string
          model_used: 'gpt-3.5-turbo' | 'gpt-4'
          tokens_used?: number
          pdf_url?: string | null
          is_favorited?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          job_description?: string
          company_name?: string | null
          position_title?: string | null
          generated_content?: string
          model_used?: 'gpt-3.5-turbo' | 'gpt-4'
          tokens_used?: number
          pdf_url?: string | null
          is_favorited?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          month_year: string
          resumes_generated: number
          total_tokens_used: number
          gpt4_tokens_used: number
          gpt35_tokens_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month_year: string
          resumes_generated?: number
          total_tokens_used?: number
          gpt4_tokens_used?: number
          gpt35_tokens_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month_year?: string
          resumes_generated?: number
          total_tokens_used?: number
          gpt4_tokens_used?: number
          gpt35_tokens_used?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      can_generate_resume: {
        Args: {
          p_user_id: string
          p_model: 'gpt-3.5-turbo' | 'gpt-4'
        }
        Returns: boolean
      }
      increment_usage: {
        Args: {
          p_user_id: string
          p_model: 'gpt-3.5-turbo' | 'gpt-4'
          p_tokens_used: number
        }
        Returns: void
      }
    }
  }
}

// Environment variables validation
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side Supabase client for API routes
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Admin Supabase client with service role key
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Helper function to get user from session
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user details from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return null
    }

    return userData
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

// Helper function to create or update user profile
export async function upsertUserProfile(userId: string, profileData: Partial<Database['public']['Tables']['user_profiles']['Insert']>) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profileData
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error upserting user profile:', error)
    throw error
  }
}

// Helper function to check if user can generate resume
export async function canUserGenerateResume(userId: string, model: 'gpt-3.5-turbo' | 'gpt-4'): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase.rpc('can_generate_resume', {
      p_user_id: userId,
      p_model: model
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error checking resume generation limits:', error)
    return false
  }
}

// Helper function to increment usage after resume generation
export async function incrementUsage(userId: string, model: 'gpt-3.5-turbo' | 'gpt-4', tokensUsed: number) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_model: model,
      p_tokens_used: tokensUsed
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error incrementing usage:', error)
    throw error
  }
} 