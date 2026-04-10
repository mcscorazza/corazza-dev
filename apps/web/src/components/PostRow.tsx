// components/PostRow.tsx
import { Link } from 'react-router-dom';
import { Post } from '@corazza/types';

interface PostRowProps {
  post: Post;
}

export const PostRow = ({ post }: PostRowProps) => {
  const postUrl = `/post/${post.line.trail.slug}/${post.line.slug}/${post.slug}`;
  const formattedDate = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  });

  return (
    <Link 
      to={postUrl} 
      className="group block p-4 -mx-4 rounded-xl hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center justify-between gap-6">
        
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-sm text-slate-500 line-clamp-1 mt-1">
              {post.summary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400 font-medium whitespace-nowrap flex-shrink-0">
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
            {post.line.title}
          </span>
          <span className="w-16 text-right tabular-nums">
            {formattedDate}
          </span>
          <span className="text-slate-300 group-hover:text-blue-600 transition-colors">→</span>
        </div>
      </div>
    </Link>
  );
};