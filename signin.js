function getSigninElements(form) {
    return {
        emailInput: form.querySelector('#signinEmail'),
        passwordInput: form.querySelector('#signinPassword'),
        submitButton: form.querySelector('button[type="submit"]')
    };
}

function setSigninStatusMessage(message) {
    const statusMessage = document.querySelector('#signinStatusMessage');

    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.hidden = !message;
}

function getSigninClient() {
    if (!window.supabaseClient?.auth) {
        throw new Error('Supabase is not initialized. Check that the SDK and `supabase-client.js` are loading correctly.');
    }

    return window.supabaseClient;
}

async function handleSignin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const { emailInput, passwordInput, submitButton } = getSigninElements(form);

    if (!emailInput || !passwordInput || !submitButton) {
        return;
    }

    setSigninStatusMessage('');

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';

    try {
        const client = getSigninClient();
        const { error } = await client.auth.signInWithPassword({
            email: emailInput.value.trim(),
            password: passwordInput.value
        });

        if (error) {
            throw error;
        }

        window.location.href = 'pricing.html';
    } catch (error) {
        setSigninStatusMessage(error.message || 'Unable to sign in right now.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

document.querySelector('.auth-form')?.addEventListener('submit', handleSignin);
