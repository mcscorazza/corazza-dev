import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Post } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';


export function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [slug]);

  if (!post) return <div className="p-10 text-center">Carregando post...</div>;

  return (
    <article className="max-w-4xl mx-auto px-8 py-20 bg-zinc-50 text-xs">
      <Link title="Voltar" to="/" className="text-blue-600 hover:underline mb-8 block">
        ← Voltar para a lista
      </Link>

      <header className="mb-10">
        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
          {post.trail}
        </span>
        <h1 className="text-4xl font-extrabold mt-2 text-gray-900">
          {post.title}
        </h1>
        <p className="text-gray-400 text-sm mt-4">
          Publicado em {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </header>

      <div className="prose prose-base prose-blue md:prose-lg max-w-full mx-auto font-sans">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneLight}
                  customStyle={{
                    backgroundColor: 'transparent',
                    padding: 0,
                    margin: 0,
                    fontSize: '0.95rem',
                  }}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}