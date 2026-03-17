import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostDetailPage() {
    const { id } = useParams(); // URL'den gelen ID'yi yakalar (Örn: /post/5 ise 5'i alır)
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Az önce backend'e yazdığımız yeni uca istek atıyoruz
                const response = await axios.get(`https://localhost:7258/api/Posts/getPostById/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Yazı bulunamadı:", error);
            }
        };
        fetchPost();
    }, [id]);

    // Veri gelene kadar ekranda bu yazar
    if (!post) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Yükleniyor...</h2>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button 
                onClick={() => navigate('/')} 
                style={{ padding: '10px 15px', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                ← Ana Sayfaya Dön
            </button>

            {post.imageUrl && (
                <img 
                    src={`https://localhost:7258${post.imageUrl}`} 
                    alt={post.title} 
                    style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
                />
            )}

            <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '10px' }}>{post.title}</h1>
            
            <p style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '30px' }}>
                Kategori: {post.category?.name || 'Kategorisiz'} | Tarih: {new Date(post.createdDate).toLocaleDateString('tr-TR')}
            </p>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
                {post.blogContent}
            </div>
        </div>
    );
}