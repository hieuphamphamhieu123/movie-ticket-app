const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Movie data với working image URLs
const movies = [
  {
    title: 'A Minecraft Movie',
    poster: 'https://m.media-amazon.com/images/M/MV5BYTRjMGVhNDMtODYyNS00MzM3LWEzYjMtMWM3MzNjNDcyYzFiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    description: 'Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld.',
    rating: 6.1,
    releaseDate: '2025-03-31',
    genres: ['Adventure', 'Fantasy', 'Family'],
    duration: 95
  },
  {
    title: 'Inception',
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    rating: 8.8,
    releaseDate: '2010-07-16',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148
  },
  {
    title: 'The Dark Knight',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    rating: 9.0,
    releaseDate: '2008-07-18',
    genres: ['Action', 'Crime', 'Drama'],
    duration: 152
  },
  {
    title: 'Interstellar',
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    rating: 8.6,
    releaseDate: '2014-11-05',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    duration: 169
  },
  {
    title: 'Avengers: Endgame',
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos\' actions.',
    rating: 8.4,
    releaseDate: '2019-04-26',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    duration: 181
  },
  {
    title: 'The Shawshank Redemption',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    rating: 9.3,
    releaseDate: '1994-09-23',
    genres: ['Drama'],
    duration: 142
  },
  {
    title: 'The Godfather',
    poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    rating: 9.2,
    releaseDate: '1972-03-24',
    genres: ['Crime', 'Drama'],
    duration: 175
  },
  {
    title: 'Parasite',
    poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    rating: 8.5,
    releaseDate: '2019-05-30',
    genres: ['Comedy', 'Drama', 'Thriller'],
    duration: 132
  },
  {
    title: 'Forrest Gump',
    poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    rating: 8.8,
    releaseDate: '1994-07-06',
    genres: ['Drama', 'Romance'],
    duration: 142
  },
  {
    title: 'Pulp Fiction',
    poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    rating: 8.9,
    releaseDate: '1994-10-14',
    genres: ['Crime', 'Drama'],
    duration: 154
  },
  {
    title: 'The Matrix',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    rating: 8.7,
    releaseDate: '1999-03-31',
    genres: ['Action', 'Sci-Fi'],
    duration: 136
  },
  {
    title: 'The Lord of the Rings: The Return of the King',
    poster: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
    description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam.',
    rating: 9.0,
    releaseDate: '2003-12-17',
    genres: ['Action', 'Adventure', 'Drama'],
    duration: 201
  },
  {
    title: 'Fight Club',
    poster: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    rating: 8.8,
    releaseDate: '1999-10-15',
    genres: ['Drama'],
    duration: 139
  },
  {
    title: 'The Lion King',
    poster: 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_FMjpg_UX1000_.jpg',
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    rating: 8.5,
    releaseDate: '1994-06-24',
    genres: ['Animation', 'Adventure', 'Drama'],
    duration: 88
  },
  {
    title: 'Gladiator',
    poster: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
    rating: 8.5,
    releaseDate: '2000-05-05',
    genres: ['Action', 'Adventure', 'Drama'],
    duration: 155
  }
];

// Function to seed movies
async function seedMovies() {
  console.log('🌱 Starting to seed movies...');
  console.log('📊 Total movies to add:', movies.length);
  
  let successCount = 0;
  let errorCount = 0;

  for (const movie of movies) {
    try {
      // Add movie to Firestore
      const docRef = await db.collection('movies').add(movie);
      console.log(`✅ Added: ${movie.title} (ID: ${docRef.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error adding ${movie.title}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📈 Summary:');
  console.log(`✅ Successfully added: ${successCount} movies`);
  console.log(`❌ Failed: ${errorCount} movies`);
  console.log('🎉 Seeding complete!');
  
  process.exit(0);
}

// Run the seed function
seedMovies().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});