import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Post } from '@corazza/types';


export function PostPage() {
  const { slug } = useParams();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [linePosts, setLinePosts] = useState<Post[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    axios.get(`${apiUrl}/posts/${slug}`)
      .then(res => setCurrentPost(res.data));
  }, [slug]);

  useEffect(() => {
    if (currentPost?.line) {
      axios.get(`${apiUrl}/lines/${currentPost.line}`)
        .then(res => setLinePosts(res.data));
    }
  }, [currentPost]);

  if (!currentPost) return <div className="p-10 text-center">Carregando post...</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[256px_1fr_256px] gap-12 px-6 py-12">
      <aside className="w-64 hidden lg:block sticky top-24 h-fit">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          {currentPost?.line}
        </h3>

        <div className="relative border-l-8 border-violet-400 ml-3 py-2">
          {linePosts.map((p) => {
            const isCurrent = p.slug === currentPost?.slug;
            const isPast = linePosts.findIndex(x => x.slug === p.slug) <
              linePosts.findIndex(x => x.slug === currentPost?.slug);

            return (
              <div key={p.slug} className="mb-8 ml-6 relative">
                <div className={`absolute -left-[36px] top-1 w-4 h-4 rounded-full border-2 bg-white 
                ${isCurrent ? 'border-violet-600 scale-125' : 'border-slate-900'}`}
                />

                <Link
                  to={`/post/${p.slug}`}
                  className={`text-sm transition-colors block
                  ${isCurrent ? 'font-bold text-slate-900' :
                      isPast ? 'text-slate-600 hover:text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {p.title}
                </Link>
              </div>
            );
          })}
        </div>
      </aside>

      <article className="prose prose-slate lg:prose-xl max-w-none w-full">
        <Link title="Voltar" to="/" className="text-blue-600 hover:underline mb-8 block">
          ← Voltar para a lista
        </Link>

        <header>
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
            {currentPost.trail}
          </span>
        </header>

        <div className="prose prose-sm prose-blue md:prose-base max-w-full mx-auto font-sans">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => {
                if (typeof children === 'object' && children !== null) {
                  const isImage = (children as any).type === 'img' || (children as any).props?.node?.tagName === 'img';
                  if (isImage) return <>{children}</>;
                }
                return <p className="mb-4 leading-relaxed">{children}</p>;
              },
              img: ({ node, ...props }) => {
                const [url, label] = props.src?.split('#') || [];

                const classMap: Record<string, string> = {
                  small: 'max-w-[300px] shadow-md',
                  side: 'max-w-[40%] float-right ml-4 mb-4',
                  full: 'w-full shadow-2xl',
                  center: 'max-w-[70%] mx-auto display-block'
                };

                const customClass = label ? classMap[label] : 'max-w-[70%] mx-auto';

                return (
                  <figure className="text-center my-10">
                    <img src={url} className={customClass} />
                    {props.alt && (
                      <figcaption className="text-sm text-gray-500 mt-2 italic">
                        {props.alt}
                      </figcaption>
                    )}
                  </figure>
                );
              },
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
                    {String(children).trim().replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {currentPost.content}
          </ReactMarkdown>
        </div>
      </article>
      <div className="hidden lg:block w-64"></div>
    </div>
  );
}