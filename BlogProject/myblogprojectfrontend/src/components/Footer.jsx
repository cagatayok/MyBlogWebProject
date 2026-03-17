import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <p>© {currentYear} <span className="footer-highlight">BarsLab</span>. Siber güvenlik ve yazılım dünyasından notlar. Tüm hakları saklıdır.</p>
        </footer>
    );
}