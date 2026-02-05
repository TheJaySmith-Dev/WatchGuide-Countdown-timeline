
import { TMDBResponse, Movie, MovieDetail } from '../types';

const API_KEY = '53b0ac93f3955b6a6ccb9782752fecf1';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Top 10 American Studios & Major Subsidiaries TMDB IDs:
 */
const MAJOR_AMERICAN_STUDIO_IDS = [
  2, 420, 1, 3, 25,          // Disney Group
  174, 9993, 12,            // Warner Group
  33, 521, 10142,           // Universal Group
  5, 559, 34,               // Sony Group
  4,                         // Paramount
  1632,                      // Lionsgate
  21, 20580,                 // MGM / Amazon
  1753,                      // Netflix
  136067,                    // Apple
  41077                      // A24
].join('|');

export const fetchMoviesByYear = async (year: number): Promise<Movie[]> => {
  try {
    const pagesToFetch = [1, 2, 3, 4, 5];
    const fetchPage = async (page: number) => {
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=primary_release_date.asc&include_adult=false&include_video=false&page=${page}&primary_release_year=${year}&with_companies=${MAJOR_AMERICAN_STUDIO_IDS}`
      );
      if (!response.ok) return [];
      const data: TMDBResponse = await response.json();
      return data.results || [];
    };

    const results = await Promise.all(pagesToFetch.map(page => fetchPage(page)));
    const allMovies = results.flat();

    const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());

    return uniqueMovies
      .filter(m => m.release_date && m.poster_path && m.release_date.startsWith(year.toString()))
      .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetail | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
