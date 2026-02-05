
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchMoviesByYear } from './services/tmdb';
import { getCinematicOutlook } from './services/gemini';
import { Movie, YearOutlook } from './types';
import MovieCard from './components/MovieCard';
import MovieDetail from './components/MovieDetail';
import { Loader2, Film, ChevronRight, TrendingUp, Sparkles, CalendarClock } from 'lucide-react';

const App: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const availableYears = useMemo(() => {
    const years = [];
    for (let y = currentYear; y <= 2030; y++) years.push(y);
    return years;
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [outlook, setOutlook] = useState<YearOutlook | null>(null);
  const [outlookLoading, setOutlookLoading] = useState<boolean>(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  
  const loadData = useCallback(async (year: number) => {
    setLoading(true);
    setOutlookLoading(true);
    
    const movieData = await fetchMoviesByYear(year);
    setMovies(movieData);
    setLoading(false);

    if (movieData.length > 0) {
      const aiData = await getCinematicOutlook(year, movieData.map(m => m.title));
      setOutlook(aiData);
    } else {
      setOutlook(null);
    }
    setOutlookLoading(false);
  }, []);

  useEffect(() => {
    loadData(selectedYear);
  }, [selectedYear, loadData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="font-display text-2xl tracking-wider hidden sm:block">CINETIME</span>
          </div>

          <nav className="flex gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedYear === year 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {year}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        {/* Year Introduction */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-6">
            <CalendarClock size={12} />
            <span>Major Studio Tracker Active</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-display uppercase leading-none mb-4">
            American <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Premieres</span> {selectedYear}
          </h1>
          <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-10">
            Curation of Disney • Warner Bros • Universal • Sony • Paramount • Lionsgate • Amazon • Netflix • Apple • A24
          </p>
          
          {/* AI Outlook Section */}
          <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Sparkles className="text-blue-400 animate-pulse" size={24} />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
                  Studio Landscape Analysis
                </h2>
                {outlookLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 leading-relaxed mb-4 italic">
                      "{outlook?.summary}"
                    </p>
                    {outlook?.anticipatedTrends && (
                      <div className="flex flex-wrap gap-2">
                        {outlook.anticipatedTrends.map((trend, i) => (
                          <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400 uppercase font-bold">
                            {trend}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Controls */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Chronological Slate</span>
          </div>
          <span className="text-gray-500 text-xs font-mono">{movies.length} PREMIERES IDENTIFIED</span>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-500 animate-pulse font-mono text-sm tracking-widest">FILTERING STUDIO VAULTS...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="relative space-y-12 md:space-y-0">
            {movies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                index={index} 
                onClick={(id) => setSelectedMovieId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <Film size={48} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-2xl font-display text-gray-500">The slate for {selectedYear} is still being finalized</h3>
            <p className="text-gray-600 mt-2">Check back as production houses announce their official release windows.</p>
          </div>
        )}

        {/* Next Year Teaser */}
        {!loading && selectedYear < 2030 && (
          <div className="mt-24 text-center">
            <button 
              onClick={() => { setSelectedYear(prev => prev + 1); scrollToTop(); }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-tighter rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <span>Explore {selectedYear + 1} Slate</span>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovieId && (
        <MovieDetail 
          movieId={selectedMovieId} 
          onClose={() => setSelectedMovieId(null)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Film size={16} />
            </div>
            <span className="font-display text-xl tracking-wider">CINETIME</span>
          </div>
          <div className="flex gap-12 text-sm text-gray-500 uppercase font-bold tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#" className="hover:text-blue-500 transition-colors">API Metadata</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
          </div>
          <div className="text-gray-600 text-[10px] tracking-widest uppercase">
            Curated Major Studio Experience • Powered by TMDB & Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
