import { useEffect, useState } from 'react';
import axios from 'axios';

import { Home } from './pages/Home';
import { Post } from '@corazza/types';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    axios.get<Post[]>(`${apiUrl}/posts`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Erro:", err));
  }, []);

  if (loading) return <div className="p-20 text-center text-slate-400">Carregando...</div>;

  return <Home posts={posts} />;
}