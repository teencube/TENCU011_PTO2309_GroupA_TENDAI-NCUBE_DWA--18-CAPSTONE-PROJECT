
import { createClient  } from '@supabase/supabase-js'
const supabaseUrl = 'https://ecbsulqwbamkkwrcjatf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYnN1bHF3YmFta2t3cmNqYXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzE2NTEsImV4cCI6MjA0MTg0NzY1MX0.cacVmc01QLXn_rpGToYe9vFa-tXHNLc290ttVEnEQKI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase