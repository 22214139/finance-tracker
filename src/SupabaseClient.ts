import { createClient } from '@supabase/supabase-js'

// آدرس Project URL رو از عکس کپی کن و اینجا بذار
const supabaseUrl = 'https://xycpvaiubrcjrfisoujk.supabase.co'

// کد Anon Key رو از عکس کپی کن و اینجا بذار
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Y3B2YWl1YnJjanJmaXNvdWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjkxMjAsImV4cCI6MjA4ODY0NTEyMH0.UrG5PfYVXfSU3SBvD5YT4QPa3CNjwgzc9i-KwFfwxtg' 

export const supabase = createClient(supabaseUrl, supabaseKey)