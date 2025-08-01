document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const errorMessage = document.getElementById('error-message') as HTMLDivElement;

    let apiBaseUrl: string;
    //if (window.location.hostname === "localhost" && window.location.port === "3000") {
    if (window.location.hostname === "localhost") {
        apiBaseUrl = "https://localhost:3000";
    } else {
        // Insert '-admin' before the first dot in the hostname
        const hostParts = window.location.hostname.split(".");
        hostParts[0] = hostParts[0] + "-admin";
        const adminHost = hostParts.join(".");
        apiBaseUrl = `https://${adminHost}:4433`;
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