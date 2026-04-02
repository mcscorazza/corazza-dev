import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Post } from './types'

function App() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Busca os posts da sua API local
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Erro ao buscar posts:", err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header Estilizado */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold tracking-tight">
            corazza<span className="text-blue-600">.dev</span>
          </h1>
          <p className="text-gray-500 text-sm">Full Stack Journey & Portfolio</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Posts Recentes</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <article key={post.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {post.trail}
              </span>
              <h3 className="text-lg font-bold mt-3 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.content.substring(0, 100)}...
              </p>
              <Link
                to={`/post/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Ler mais →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App