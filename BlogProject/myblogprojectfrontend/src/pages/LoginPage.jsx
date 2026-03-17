import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import barslabLogo from '../assets/barslab_logo.png';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://localhost:7258/api/Auth/login', {
                email: email,
                password: password
            });

            const token = response.data.token || response.data;
            localStorage.setItem('token', token);
            navigate('/admin');

        } catch (err) {
            console.error("Login hatası:", err);
            setError('Giriş başarısız. E-posta veya şifreniz hatalı olabilir.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-box">

                <img
                    className="logo-image"
                    src={barslabLogo}
                    alt="Sibervatan Logo"
                />

                <h2 className="login-title">Yönetici Girişi 🔒</h2>
                <br />

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">E-posta Adresi</label>
                        <input
                            className="form-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required

                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Şifre</label>
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="login-submit-btn" type="submit">
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}