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

function handleSignup(e) {
    e.preventDefault();

    const passwordInput = e.target.querySelector('#signupPassword');
    const confirmPasswordInput = e.target.querySelector('#signupConfirmPassword');

    if (!passwordInput || !confirmPasswordInput) {
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        setPasswordMismatchError(true);
        return;
    }

    setPasswordMismatchError(false);

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.disabled = true;
    btn.innerText = 'Continuing...';
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        window.location.href = 'pricing.html';
    }, 1500);
}
