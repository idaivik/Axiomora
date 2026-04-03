const AUTH_NAV_SUPABASE_URL = 'https://nxtfbyvacunsiytlsfkl.supabase.co';
const AUTH_NAV_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dGZieXZhY3Vuc2l5dGxzZmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODUwNzgsImV4cCI6MjA4OTA2MTA3OH0.DojA5driPSrZYoOsGJTM_hcvL_EX0uxIYxuLiHuhYU8';

function getAuthNavButton() {
    return document.querySelector('.nav-btn');
}

function setNavButtonState(isSignedIn) {
    const navButton = getAuthNavButton();

    if (!navButton) {
        return;
    }

    if (!navButton.dataset.defaultHref) {
        navButton.dataset.defaultHref = navButton.getAttribute('href') || 'signin.html';
    }

    if (!navButton.dataset.defaultLabel) {
        navButton.dataset.defaultLabel = navButton.textContent.trim();
    }

    if (isSignedIn) {
        navButton.textContent = 'Profile';
        navButton.setAttribute('href', 'dashboard.html');
        return;
    }

    navButton.textContent = navButton.dataset.defaultLabel;
    navButton.setAttribute('href', navButton.dataset.defaultHref);
}

function getAuthNavClient() {
    if (window.supabaseClient?.auth) {
        return window.supabaseClient;
    }

    if (!window.supabase?.createClient) {
        return null;
    }

    return window.supabase.createClient(AUTH_NAV_SUPABASE_URL, AUTH_NAV_SUPABASE_ANON_KEY);
}

async function syncAuthNavButton() {
    const client = getAuthNavClient();

    if (!client?.auth) {
        return;
    }

    try {
        const { data, error } = await client.auth.getSession();

        if (error) {
            throw error;
        }

        setNavButtonState(Boolean(data.session));
    } catch (error) {
        setNavButtonState(false);
    }
}

function initAuthNavButton() {
    const client = getAuthNavClient();

    syncAuthNavButton();

    if (!client?.auth) {
        return;
    }

    client.auth.onAuthStateChange((_event, session) => {
        setNavButtonState(Boolean(session));
    });
}

initAuthNavButton();
