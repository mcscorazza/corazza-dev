import { PostCard } from '../components/PostCard';
import { Post } from '@corazza/types';

interface HomeProps {
  posts: Post[];
}

export const Home = ({ posts }: HomeProps) => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header da Home */}
      <header className="mb-16 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Conteúdo Técnico <span className="text-blue-600">&</span> Vlogs
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Explorando Data Science, desenvolvimento com React e a jornada de construção do corazza.dev.
        </p>
      </header>

      {/* Grid de Posts */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
};