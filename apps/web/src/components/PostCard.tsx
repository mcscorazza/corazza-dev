import { Link } from 'react-router-dom';

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  trail: string;
  line: string;
  createdAt: string; // O Axios costuma retornar datas como string ISO
}

// Se o PostCard recebe apenas o objeto post:
interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const trailColors: Record<string, string> = {
    'React': 'text-cyan-600 bg-cyan-50 border-cyan-100',
    'Data Science': 'text-purple-600 bg-purple-50 border-purple-100',
    'Carreira': 'text-emerald-600 bg-emerald-50 border-emerald-100',
    'Default': 'text-slate-600 bg-slate-50 border-slate-100'
  };

  const style = trailColors[post.trail] || trailColors.Default;

  return (
    <Link to={`/post/${post.slug}`} className="group">
      <article className="h-full flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
        
        {/* Badges de Trilha e Linha */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${style}`}>
            {post.trail}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            {post.line}
          </span>
        </div>

        {/* Título com efeito de hover */}
        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 leading-tight mb-3 transition-colors">
          {post.title}
        </h2>

        {/* Preview do texto (limitado a 3 linhas) */}
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {/* Removemos tags Markdown básicas para o preview não ficar sujo */}
          {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
        </p>

        {/* Rodapé do Card */}
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