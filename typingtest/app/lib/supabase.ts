import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnkaavxxkqpjxegsqgpr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2Fhdnh4a3FwanhlZ3NxZ3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODg0NzUsImV4cCI6MjA5MjY2NDQ3NX0.QRR6mm-Y_pKMlhybEAcOUPmJQe8RUcF_0azCYEZCYKY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)