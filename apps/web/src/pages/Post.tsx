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

  const { trailSlug, lineSlug, postSlug } = useParams();
  const [expandedTrail, setExpandedTrail] = useState<string | null>(null);

  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [linePosts, setLinePosts] = useState<Post[]>([]);
  const [allTrails, setAllTrails] = useState<TrailSummary[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    axios.get(`${apiUrl}/posts/${trailSlug}/${lineSlug}/${postSlug}`)
      .then(res => setCurrentPost(res.data));
  }, [trailSlug, lineSlug, postSlug]);

  useEffect(() => {
    axios.get(`${apiUrl}/trails`)
      .then(res => setAllTrails(res.data))
      .catch(err => console.error("Erro nas trilhas:", err));
  }, [apiUrl]);

  useEffect(() => {
    if (currentPost?.line?.slug && currentPost?.line?.trail?.slug) {
      const tSlug = currentPost.line.trail.slug;
      const lSlug = currentPost.line.slug;

      axios.get(`${apiUrl}/lines/${tSlug}/${lSlug}`)
        .then(res => setLinePosts(res.data))
        .catch(err => console.error("Erro ao carregar timeline:", err));
    }
  }, [currentPost, apiUrl]);

  useEffect(() => {
    if (currentPost) {
      setExpandedTrail(currentPost.line.trail.slug);
    }
  }, [currentPost]);

  if (!currentPost) return <div className="p-10 text-center">Carregando post...</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[256px_1fr_256px]">

      <aside className="w-64 hidden lg:block sticky top-24 h-fit">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          {currentPost.line.title}
        </h3>

        <div className="relative border-l-8 border-violet-400 ml-3 py-2">
          {linePosts.map((p) => {
            const isCurrent = p.slug === currentPost.slug;
            const isPast = linePosts.findIndex(x => x.slug === p.slug) <
              linePosts.findIndex(x => x.slug === currentPost.slug);

            return (
              <div key={p.slug} className="mb-4 ml-6 relative">
                <div className={`absolute -left-[36px] top-1 w-4 h-4 rounded-full border-2 bg-white 
                ${isCurrent ? 'border-violet-600 scale-125' : 'border-slate-900'}`}
                />

                <Link
                  to={`/post/${trailSlug}/${lineSlug}/${p.slug}`}
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

      <article className="prose prose-slate lg:prose-xl max-w-1fr mx-auto w-full bg-white p-8">
        <Link title="Voltar" to="/" className="text-blue-600 hover:underline mb-8 block">
          ← Voltar para a lista
        </Link>
        {/* 
        <header className="mb-8">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
            {currentPost.line.trail.title}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
            {currentPost.title}
          </h1>
        </header> */}

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

      <aside className="w-64 hidden lg:block sticky top-24 h-fit">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
          Explorar Conteúdo
        </h3>

        <div className="flex flex-col gap-3">
          {allTrails.map(trail => {
            const isCurrentTrail = trail.slug === currentPost?.line?.trail?.slug;
            const isExpanded = expandedTrail === trail.slug;

            return (
              <div
                key={trail.id}
                className={`rounded-2xl border transition-all overflow-hidden ${isCurrentTrail ? 'border-violet-200 shadow-sm' : 'border-slate-100'
                  }`}
              >
                <button
                  onClick={() => setExpandedTrail(isExpanded ? null : trail.slug)}
                  className={`w-full text-left p-4 flex flex-col transition-colors ${isExpanded ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`font-bold text-sm ${isCurrentTrail ? 'text-violet-600' : 'text-slate-900'}`}>
                      {trail.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase mt-1">
                    {trail.lines.length} Linhas • {trail.postsCount} Estações
                  </span>
                </button>

                {isExpanded && (
                  <div className="bg-white p-2 flex flex-col gap-1 border-t border-slate-100">
                    {trail.lines.map((line: any) => {
                      const isCurrentLine = line.slug === currentPost?.line?.slug;

                      return (
                        <Link
                          key={line.slug}
                          to={`/post/${trail.slug}/${line.slug}/${line.firstPostSlug}`}
                          className={`text-xs p-3 rounded-lg flex items-center justify-between group transition-all ${isCurrentLine
                              ? 'bg-violet-600 text-white font-bold'
                              : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                        >
                          <span>{line.title}</span>
                          {!isCurrentLine && <span className="opacity-0 group-hover:opacity-100">→</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}