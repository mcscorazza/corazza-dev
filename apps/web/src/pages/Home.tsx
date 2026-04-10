import { Link } from 'react-router-dom';
import { TrailSummary } from '@corazza/types';


export const Home = ({ trails }: { trails: TrailSummary[] }) => (
  <div>
    {trails.map(trail => (
        <div>
        <Link key={trail.id} to={`/trail/${trail.slug}`}><h2>{trail.title}</h2></Link>
        <div>Linhas: {trail.linesCount}</div>
        <div>Estações: {trail.postsCount}</div>
        </div>
    ))};
  </div>
);