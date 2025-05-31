import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const [credentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Test credentials for development
        if (credentials.usernameOrEmail === 'test' && credentials.password === 'test123') {
            // Simulate successful login
            console.log('Login successful, calling login function...');
            login('test-token');
            console.log('Auth state after login:', { isAuthenticated, token: localStorage.getItem('auth_token') });
            navigate('/');
        } else {
            setError('Invalid credentials. Use test/test123 for development.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username or Email:</label>
                    <input
                        type="text"
                        value={credentials.usernameOrEmail}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            usernameOrEmail: e.target.value
                        })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                            ...credentials,
                            password: e.target.value
                        })}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <div className="dev-info">
                <p>Development credentials:</p>
                <p>Username: test</p>
                <p>Password: test123</p>
            </div>
        </div>
    );
}; 