
import React from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import Countdown from './Countdown';
import { Calendar, Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onClick }) => {
  const isEven = index % 2 === 0;

  return (
    <div 
      className={`relative flex items-center justify-between w-full mb-12 md:mb-24 group cursor-pointer`}
      onClick={() => onClick(movie.id)}
    >
      {/* Central Line Decorator */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-600/50 to-purple-600/50 hidden md:block" />
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10 hidden md:block group-hover:scale-150 transition-all duration-300" />

      {/* Content Container */}
      <div className={`flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Poster side */}
        <div className={`w-full md:w-[45%] flex ${isEven ? 'justify-end md:pr-12' : 'justify-start md:pl-12'}`}>
          <div className="relative group/poster overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-blue-500/50 hover:shadow-blue-500/20 w-full max-w-sm">
            <img 
              src={getImageUrl(movie.poster_path)} 
              alt={movie.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover/poster:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            
            {/* Overlay Info for small screens */}
            <div className="absolute bottom-4 left-4 md:hidden">
               <Countdown targetDate={movie.release_date} />
            </div>
          </div>
        </div>

        {/* Info side */}
        <div className={`w-full md:w-[45%] mt-6 md:mt-0 px-4 md:px-0 text-left ${isEven ? 'md:text-left' : 'md:text-right'}`}>
          <div className={`flex flex-col ${isEven ? 'items-start' : 'items-end'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold tracking-widest uppercase rounded">
                {new Date(movie.release_date) < new Date() ? 'Recently Released' : 'Anticipated'}
              </span>
              <div className="flex items-center text-yellow-500 gap-1 text-sm">
                <Star size={14} fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-display uppercase tracking-tight mb-3 group-hover:text-blue-400 transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center gap-2 text-gray-400 mb-4 font-medium">
              <Calendar size={16} />
              <span>{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-lg">
              {movie.overview}
            </p>

            <div className="hidden md:block">
              <Countdown targetDate={movie.release_date} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
