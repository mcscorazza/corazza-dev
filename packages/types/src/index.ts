export interface Trail {
  title: string;
  slug: string;
}

export interface Line {
  id: string;
  title: string;
  slug: string;
  trail: Trail;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  line: Line;
  createdAt: string;
  updatedAt?: string;
}

  export interface TrailSummary {
    id: string;
    title: string;
    lines: string[];
    slug: string;
    linesCount: number;
    postsCount: number;
  }