/**
 * Student Tracker Signup Logic
 * Handles form submission.
 */

function handleSignup(e) {
    e.preventDefault();
    // Mock API Call
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.disabled = true;
    btn.innerText = 'Creating Account...';
    
    setTimeout(() => {
        alert(`Welcome! Please check your email to verify your account.`);
        btn.innerText = originalText;
        btn.disabled = false;
        // Redirect logic would go here
    }, 1500);
}