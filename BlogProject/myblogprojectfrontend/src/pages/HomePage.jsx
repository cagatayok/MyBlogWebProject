import { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://localhost:7258/api/Posts/getAllPosts');
                setPosts(response.data);
            } catch (error) {
                console.error("Bloglar çekilirken hata oluştu:", error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="home-container">
            <h1 className="header-title">BarsLab Blog 🚀</h1>
            <p className="header-subtitle">Siber güvenlik, yazılım ve teknoloji dünyasından en güncel notlar...</p>

            {posts.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
                    Yükleniyor veya henüz blog yazısı bulunmuyor...
                </p>
            ) : (
                <div className="blog-grid">
                    {posts.map((post) => (
                        <div className="blog-card" key={post.id}>

                            {/* Resim Alanı */}
                            {post.imageUrl ? (
                                <img
                                    className="blog-image"
                                    src={`https://localhost:7258${post.imageUrl}`}
                                    alt={post.title}
                                />
                            ) : (
                                <div className="image-placeholder">Resim Yok</div>
                            )}

                            {/* İçerik Alanı */}
                            <div className="blog-content">
                                <span className="blog-category">
                                    {post.category?.name || 'Kategorisiz'}
                                </span>

                                <h2 className="blog-title">{post.title}</h2>

                                <p className="blog-excerpt">
                                    {post.blogContent.substring(0, 120)}...
                                </p>

                                {/* Kartın En Altı: Tarih ve Buton */}
                                <div className="blog-footer">
                                    <span className="blog-date">
                                        {new Date(post.createdDate).toLocaleDateString('tr-TR')}
                                    </span>
                                    <button
                                        className="read-more-btn"
                                        onClick={() => navigate(`/post/${post.id}`)} // <-- İşte sihirli yönlendirme satırı!
                                    >
                                        Devamını Oku
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}