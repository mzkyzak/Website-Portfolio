import { createClient } from '@supabase/supabase-js';

// Mengambil data dari .env (untuk Create React App harus REACT_APP_)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validasi sederhana agar tidak langsung blank screen
if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️ Supabase URL atau Key belum terisi di .env!");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseKey || 'placeholder-key'
);
