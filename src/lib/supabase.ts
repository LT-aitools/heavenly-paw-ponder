
import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to demo values for development
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

// Don't throw an error, instead use mock data for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since this is an anonymous session
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Type for our base_figures table
export interface BaseFigures {
  id: number;
  year: number;
  humans: number;
  dogs: number;
  unbaptized_infants: number;
  never_heard: number;
  monotheists: number;
  atheists_polytheists: number;
  in_purgatory: number;
  catholic: number;
  protestant_evangelical: number;
  protestant_mainline: number;
  christian_orthodox: number;
  jew_orthodox: number;
  jew_reform: number;
  muslim_sunni: number;
  muslim_shia: number;
  universalist: number;
} 
