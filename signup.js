/**
 * Student Tracker Signup Logic
 * Handles form submission.
 */

function initPasswordToggles() {
    const passwordFields = document.querySelectorAll('.password-field');

    passwordFields.forEach((field) => {
        const input = field.querySelector('.password-input');
        const toggle = field.querySelector('.password-toggle');

        if (!input || !toggle) {
            return;
        }

        toggle.addEventListener('click', () => {
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            toggle.textContent = isHidden ? 'Hide' : 'Show';
            toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
            toggle.setAttribute('aria-pressed', String(isHidden));
        });
    });
}

initPasswordToggles();

function setPasswordMismatchError(shouldShow) {
    const confirmPasswordInput = document.querySelector('#signupConfirmPassword');
    const errorMessage = document.querySelector('#passwordMatchError');

    if (!confirmPasswordInput || !errorMessage) {
        return;
    }

    errorMessage.hidden = !shouldShow;

    if (shouldShow) {
        confirmPasswordInput.setAttribute('aria-invalid', 'true');
    } else {
        confirmPasswordInput.removeAttribute('aria-invalid');
    }
}

function getSignupClient() {
    if (!window.supabaseClient?.auth) {
        throw new Error('Supabase is not initialized. Check that the SDK and `supabase-client.js` are loading correctly.');
    }

    return window.supabaseClient;
}

async function handleSignup(e) {
    e.preventDefault();

    const form = e.target;
    const fullNameInput = form.querySelector('#signupFullName');
    const emailInput = form.querySelector('#signupEmail');
    const passwordInput = form.querySelector('#signupPassword');
    const confirmPasswordInput = form.querySelector('#signupConfirmPassword');
    const statusMessage = form.querySelector('#signupStatusMessage');

    if (!fullNameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        setPasswordMismatchError(true);
        return;
    }

    setPasswordMismatchError(false);

    if (statusMessage) {
        statusMessage.hidden = true;
        statusMessage.textContent = '';
    }

    const btn = form.querySelector('button[type="submit"]');

    if (!btn) {
        return;
    }

    const originalText = btn.innerText;

    btn.disabled = true;
    btn.innerText = 'Creating account...';

    try {
        const client = getSignupClient();
        const { data, error } = await client.auth.signUp({
            email: emailInput.value.trim(),
            password: passwordInput.value,
            options: {
                data: {
                    full_name: fullNameInput.value.trim()
                }
            }
        });

        if (error) {
            throw error;
        }

        if (data.session) {
            window.location.href = 'pricing.html';
            return;
        }

        window.location.href = 'signin.html';
    } catch (error) {
        if (statusMessage) {
            statusMessage.textContent = error.message || 'Unable to create your account right now.';
            statusMessage.hidden = false;
        }
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
