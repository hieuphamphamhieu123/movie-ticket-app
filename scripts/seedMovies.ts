import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase.config';

const sampleMovies = [
  {
    title: "The Quiet Ones",
    overview: "A university student and some classmates are recruited to carry out a private experiment -- to create a poltergeist.",
    poster_path: "https://image.tmdb.org/t/p/w500/fJ5MZ4H6UHAa2xyh8xYQDRsMpc9.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/xJWPZIYOEFIjZpBL7SVBGnzRYXp.jpg",
    vote_average: 6.1,
    release_date: "2014-04-10",
    genres: ["Horror", "Thriller"],
    duration: 98
  },
  {
    title: "Turno Nocturno",
    overview: "A night shift worker discovers dark secrets at her workplace.",
    poster_path: "https://image.tmdb.org/t/p/w500/example2.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/example2_backdrop.jpg",
    vote_average: 7.2,
    release_date: "2024-03-15",
    genres: ["Thriller", "Mystery"],
    duration: 105
  },
  {
    title: "In the Lost Lands",
    overview: "A queen, desperate to obtain the gift of shapeshifting, makes a daring play: she hires the sorceress Gray Alys.",
    poster_path: "https://image.tmdb.org/t/p/w500/example3.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/example3_backdrop.jpg",
    vote_average: 6.8,
    release_date: "2024-11-20",
    genres: ["Fantasy", "Adventure"],
    duration: 112
  },
  {
    title: "A Minecraft Movie",
    overview: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld.",
    poster_path: "https://image.tmdb.org/t/p/w500/example4.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/example4_backdrop.jpg",
    vote_average: 6.5,
    release_date: "2025-03-31",
    genres: ["Adventure", "Fantasy", "Family"],
    duration: 95
  },
  {
    title: "The Codes of War",
    overview: "A gripping war drama about cryptographers during WWII.",
    poster_path: "https://image.tmdb.org/t/p/w500/example5.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/w500/example5_backdrop.jpg",
    vote_average: 7.8,
    release_date: "2024-09-12",
    genres: ["War", "Drama", "History"],
    duration: 128
  },
  // Add more movies as needed
];

export const seedMovies = async () => {
  try {
    const moviesRef = collection(db, 'movies');
    
    for (const movie of sampleMovies) {
      await addDoc(moviesRef, movie);
      console.log(`Added movie: ${movie.title}`);
    }
    
    console.log('All movies seeded successfully!');
  } catch (error) {
    console.error('Error seeding movies:', error);
  }
};

// Uncomment to run: seedMovies();