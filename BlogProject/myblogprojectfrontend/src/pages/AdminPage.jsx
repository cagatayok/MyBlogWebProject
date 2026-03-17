import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

export default function AdminPage() {
    const navigate = useNavigate();

    // --- STATES ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Başlangıç Kontrolleri
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchCategories();
        fetchPosts();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://localhost:7258/api/Categories/getAllCategories');
            setCategories(response.data);
        } catch (error) {
            console.error("Kategoriler çekilemedi:", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('https://localhost:7258/api/Posts/getAllPosts');
            setPosts(response.data);
        } catch (error) {
            console.error("Yazılar çekilemedi:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            let finalImageUrl = existingImageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadResponse = await axios.post('https://localhost:7258/api/Images/upload', formData, config);
                finalImageUrl = uploadResponse.data.url;
            }

            const postData = {
                id: editingPostId ? editingPostId : 0,
                title: title,
                blogContent: content,
                categoryId: parseInt(categoryId),
                imageUrl: finalImageUrl
            };

            if (editingPostId) {
                await axios.put('https://localhost:7258/api/Posts/updatePost', postData, config);
                setMessage({ text: '✅ Blog yazısı başarıyla güncellendi!', type: 'success' });
            } else {
                await axios.post('https://localhost:7258/api/Posts/createPost', postData, config);
                setMessage({ text: '✅ Blog yazısı başarıyla eklendi!', type: 'success' });
            }

            resetForm();
            fetchPosts();
        } catch (error) {
            setMessage({ text: '❌ İşlem başarısız. Lütfen bilgileri kontrol edin.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                await axios.delete(`https://localhost:7258/api/Posts/deletePost/${id}`, config);
                setMessage({ text: '🗑️ Yazı başarıyla silindi.', type: 'success' });
                fetchPosts();
            } catch (error) {
                setMessage({ text: '❌ Silme işlemi başarısız oldu.', type: 'error' });
            }
        }
    };

    const handleEditClick = (post) => {
        setEditingPostId(post.id);
        setTitle(post.title);
        setContent(post.blogContent);
        setCategoryId(post.categoryId);
        setExistingImageUrl(post.imageUrl);
        setImageFile(null);
        if (document.getElementById('fileInput')) document.getElementById('fileInput').value = "";
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setEditingPostId(null);
        setTitle('');
        setContent('');
        setCategoryId('');
        setExistingImageUrl('');
        setImageFile(null);
        if (document.getElementById('fileInput')) document.getElementById('fileInput').value = "";
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Kontrol Paneli ⚙️</h1>
                <p className="admin-subtitle">Yazılım ve Teknoloji İçerik Yönetimi</p>
            </div>

            {/* SADECE MANUEL ÇARPI İLE KAPANAN MESAJ KUTUSU */}
            {message.text && (
                <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                    <span>{message.text}</span>
                    <button
                        onClick={() => setMessage({ text: '', type: '' })}
                        style={{
                            float: 'right',
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            lineHeight: '1'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="admin-form-card">
                <h2 style={{ color: '#ffffff', marginBottom: '25px', textAlign: 'center', fontWeight: '700' }}>
                    {editingPostId ? '✏️ Yazıyı Düzenle' : '📝 Yeni Yazı Ekle'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Blog Başlığı</label>
                        <input className="form-input" type="text" required placeholder="Başlık girin..." value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Kategori</label>
                        <select className="form-input" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="" disabled>Kategori seçiniz...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Kapak Fotoğrafı</label>
                        <input id="fileInput" className="file-input" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Blog İçeriği</label>
                        <textarea className="form-textarea" required placeholder="İçeriğinizi buraya yazın..." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
                    </div>

                    <button className="submit-btn" type="submit" disabled={isLoading}>
                        {isLoading ? 'İşleniyor...' : (editingPostId ? '🔄 Değişiklikleri Kaydet' : '🚀 Yayına Al')}
                    </button>

                    {editingPostId && (
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            ❌ Düzenlemeyi İptal Et
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-list-card">
                <h2 className="admin-list-title">📚 Yayınlanmış Yazılar</h2>
                {posts.length === 0 ? (
                    <p style={{ color: '#94a3b8', textAlign: 'center' }}>Henüz bir içerik bulunmuyor.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="post-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>BAŞLIK</th>
                                    <th>KATEGORİ</th>
                                    <th>TARİH</th>
                                    <th>İŞLEMLER</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td>#{post.id}</td>
                                        <td style={{ fontWeight: '600', color: '#ffffff' }}>{post.title}</td>
                                        <td>{post.category?.name || '-'}</td>
                                        <td>{new Date(post.createdDate).toLocaleDateString('tr-TR')}</td>
                                        <td>
                                            <button className="action-btn btn-edit" onClick={() => handleEditClick(post)}>Düzenle</button>
                                            <button className="action-btn btn-delete" onClick={() => handleDelete(post.id)}>Sil</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}