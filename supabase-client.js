const SUPABASE_URL = 'https://nxtfbyvacunsiytlsfkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dGZieXZhY3Vuc2l5dGxzZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODUwNzgsImV4cCI6MjA4OTA2MTA3OH0.DojA5driPSrZYoOsGJTM_hcvL_EX0uxIYxuLiHuhYU8';

function hasConfiguredSupabaseCredentials() {
    return (
        Boolean(SUPABASE_URL) &&
        Boolean(SUPABASE_ANON_KEY) &&
        !SUPABASE_URL.includes('your-project') &&
        !SUPABASE_URL.includes('your-supabase-url') &&
        !SUPABASE_ANON_KEY.includes('your-anon-key')
    );
}

function createSharedSupabaseClient() {
    if (!window.supabase?.createClient) {
        throw new Error('Supabase SDK is not loaded on this page.');
    }

    if (!hasConfiguredSupabaseCredentials()) {
        throw new Error('Add your real Supabase URL and public key before using authentication.');
    }

    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

window.supabaseClient = createSharedSupabaseClient();
