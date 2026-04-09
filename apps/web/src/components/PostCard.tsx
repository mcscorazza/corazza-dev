import { Link } from 'react-router-dom';
import { Post } from '@corazza/types';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const trailColors: Record<string, string> = {
    'reactjs-typescript': 'text-cyan-600 bg-cyan-50 border-cyan-100',
    'data-science': 'text-purple-600 bg-purple-50 border-purple-100',
    'databases': 'text-amber-600 bg-amber-50 border-amber-100',
    'carreira': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'default': 'text-slate-600 bg-slate-50 border-slate-100'
  };

  const trailSlug = post.line.trail.slug;
  const lineSlug = post.line.slug;
  const style = trailColors[trailSlug] || trailColors.default;

  return (
    <Link to={`/post/${trailSlug}/${lineSlug}/${post.slug}`} className="group">
      <article className="h-full flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${style}`}>
            {post.line.trail.title}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {post.line.title}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 leading-tight mb-3 transition-colors">
          {post.title}
        </h2>

        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {post.summary || post.content.replace(/[#*`]/g, '').substring(0, 150)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <time className="text-[11px] font-medium text-slate-400 uppercase">
            {new Date(post.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </time>
          <span className="text-blue-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Ler mais →
          </span>
        </div>
      </article>
    </Link>
  );
};