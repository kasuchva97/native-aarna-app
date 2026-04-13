import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://jypkofybplnhmalovbsd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cGtvZnlicGxuaG1hbG92YnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODg4NDAsImV4cCI6MjA4Nzg2NDg0MH0.6hSJnG28OfXmgfgnznGoORzOgW1aite4SkSsRlzoEik'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
