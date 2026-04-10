import { Link } from 'react-router-dom';
import { Post } from '@corazza/types';

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link to={`/post/${post.line.trail.slug}/${post.line.slug}/${post.slug}`} className="group">
      <div className="h-full flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        {/* Badge da Linha */}
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">
          {post.line.title}
        </span>
        
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
          {post.summary || "Sem resumo disponível."}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 font-medium">
            {new Date(post.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-xs font-bold text-slate-800">Ler post →</span>
        </div>
      </div>
    </Link>
  );
};