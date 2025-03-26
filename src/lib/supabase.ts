import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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