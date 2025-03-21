import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://kewqroihvhatokbmoinu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtld3Fyb2lodmhhdG9rYm1vaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MzI2MzYsImV4cCI6MjA1ODAwODYzNn0.6I7guSX76JXUuoawot_bPsIdBbPJOrsCzeX0DuynDmc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 