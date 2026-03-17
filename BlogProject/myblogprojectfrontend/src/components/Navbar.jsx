import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import barslabLogo from '../assets/barslab_logo.png';
import './Navbar.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Menü açık/kapalı takibi
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsMenuOpen(false); // Çıkış yapınca menüyü kapat
        navigate('/');
    };

    const closeMenu = () => setIsMenuOpen(false); // Linke tıklayınca menüyü kapat

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" onClick={closeMenu}>
                    <img
                        className="navbar-logo-image"
                        src={barslabLogo}
                        alt="Barslab Logo"
                    />
                </Link>
            </div>

            {/* 🍔 Hamburger İkonu (Mobilde görünür) */}
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>

            {/* 📱 Menü Linkleri */}
            <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={closeMenu}>Ana Sayfa</Link></li>

                {token ? (
                    <>
                        {/* Admin linkini temaya uydurduk, maviyi sildik */}
                        <li><Link to="/admin" onClick={closeMenu} className="admin-link">Admin Paneli</Link></li>
                        <li><button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button></li>
                    </>
                ) : (
                    <li><Link to="/login" onClick={closeMenu}>Yönetici Girişi</Link></li>
                )}
            </ul>
        </nav>
    );
}