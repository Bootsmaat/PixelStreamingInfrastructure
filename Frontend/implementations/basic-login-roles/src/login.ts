document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const errorMessage = document.getElementById('error-message') as HTMLDivElement;

    let apiBaseUrl: string;
    if (window.location.hostname === "localhost" && window.location.port === "3000") {
        apiBaseUrl = "https://localhost:3000";
    } else {
        apiBaseUrl = window.location.origin;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        try {
            const response = await fetch(`${apiBaseUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (result.success && result.token && result.webpage) {
                localStorage.setItem('auth_token', result.token);
                if (result.role !== undefined) localStorage.setItem('user_role', result.role);
                if (result.role_name) localStorage.setItem('user_role_name', result.role_name);
                window.location.href = result.webpage;
            } else {
                errorMessage.textContent = result.message || 'Invalid username or password';
                errorMessage.style.display = 'block';
            }
        } catch (err) {
            errorMessage.textContent = 'Server error. Please try again later.';
            errorMessage.style.display = 'block';
        }
    });
}); 