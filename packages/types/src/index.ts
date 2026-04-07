export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  trail: string;
  line: string;
  createdAt: string;
  updatedAt?: string;
}