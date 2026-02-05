
import React, { useEffect, useState } from 'react';
import { MovieDetail as MovieDetailType } from '../types';
import { fetchMovieDetails, getImageUrl } from '../services/tmdb';
import Countdown from './Countdown';
import { X, Calendar, Star, User, Film, Loader2, Play, ExternalLink } from 'lucide-react';

interface MovieDetailProps {
  movieId: number;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchMovieDetails(movieId);
      setMovie(data);
      setLoading(false);
    };
    load();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [movieId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!movie) return null;

  const director = movie.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown';
  const topCast = movie.credits.cast.slice(0, 6);
  const trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube') || 
                  movie.videos.results.find(v => v.site === 'YouTube');

  // Construct YouTube embed URL with origin and extra params to avoid common embedding errors
  const getEmbedUrl = (key: string) => {
    const origin = window.location.origin;
    return `https://www.youtube.com/embed/${key}?autoplay=0&rel=0&modestbranding=1&origin=${encodeURIComponent(origin)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto animate-in fade-in duration-300">
      {/* Background Backdrop */}
      <div className="absolute top-0 left-0 w-full h-[60vh] opacity-30">
        <img 
          src={getImageUrl(movie.backdrop_path, 'original')} 
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform" />
      </button>

      <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column: Poster */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="w-full" />
            </div>
            <div className="mt-8 p-6 bg-white/[0.03] border border-white/5 rounded-2xl text-center">
              <h4 className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em] mb-4">Countdown to Release</h4>
              <Countdown targetDate={movie.release_date} />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-display uppercase leading-none mb-4 tracking-tighter">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 text-blue-400 font-mono">
                <Calendar size={18} />
                <span>{new Date(movie.release_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500 font-mono">
                <Star size={18} fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)} TMDB Rating</span>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-l-2 border-blue-500 pl-4">Synopsis</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
              </section>

              {/* Trailer Section */}
              {trailer && (
                <section>
                  <div className="flex items-center justify-between mb-4 border-l-2 border-red-500 pl-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Play size={16} /> Official Trailer
                    </h3>
                    <a 
                      href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] flex items-center gap-1 text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-bold"
                    >
                      Watch on YouTube <ExternalLink size={12} />
                    </a>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                      src={getEmbedUrl(trailer.key)}
                      title={`${movie.title} Trailer`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-600 italic">
                    Note: If the video doesn't load due to studio restrictions, please use the "Watch on YouTube" link above.
                  </p>
                </section>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-l-2 border-purple-500 pl-4">Director</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                      <Film size={20} className="text-purple-400" />
                    </div>
                    <span className="text-xl font-medium">{director}</span>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-l-2 border-emerald-500 pl-4">Top Cast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {topCast.map(actor => (
                      <div key={actor.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                        {actor.profile_path ? (
                          <img src={getImageUrl(actor.profile_path, 'w500')} className="w-10 h-10 rounded-full object-cover" alt={actor.name} />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <User size={16} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{actor.name}</div>
                          <div className="text-[10px] text-gray-500 truncate">{actor.character}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
