import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Yeni sayfamızı içeri aktardık
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PostDetailPage from './pages/PostDetailPage';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Ana sayfaya girilince artık bizim HomePage bileşenimiz çalışacak */}
            <Route path="/" element={<HomePage />} />

            {/* Buraları şimdilik boş bıraktık, ileride dolduracağız */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
          </Routes>
        </div>
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;