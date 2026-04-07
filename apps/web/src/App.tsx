import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { Home } from './Pages/Home';
import { PostPage } from './Pages/Post'; // Sua página de post que já existe

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  trail: string;
  line: string;
  createdAt: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Post[]>('http://localhost:3000/api/posts')
    .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err: AxiosError) => console.error("Erro ao carregar posts:", err));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-medium">
        Carregando corazza.dev...
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50/50">
        <header className="py-6 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-black text-slate-900 tracking-tighter">
              CORAZZA<span className="text-blue-600">.DEV</span>
            </a>
          </div>
        </header>

        {/* Gerenciador de Rotas */}
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/post/:slug*" element={<PostPage />} />
        </Routes>
      </div>
  );
}