const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
// If you have an API key, add it here
// const API_KEY = 'YOUR_API_KEY';

export interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail: string | null;
  description?: string;
  isbn?: string;
}

interface GoogleBooksResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail: string;
      };
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
    };
  }[];
}

// Improve the string normalization to be more aggressive
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')  // Remove all non-alphanumeric characters
    .replace(/\s+/g, '');       // Remove all whitespace
};

// Improve duplicate detection
const areDuplicateBooks = (book1: Book, book2: Book): boolean => {
  // First check ISBNs if available
  if (book1.isbn && book2.isbn) {
    return normalizeString(book1.isbn) === normalizeString(book2.isbn);
  }
  
  // Then check by normalized title and author
  const title1 = normalizeString(book1.title);
  const title2 = normalizeString(book2.title);
  const author1 = normalizeString(book1.author);
  const author2 = normalizeString(book2.author);

  // Check if titles are very similar (exact match or one contains the other)
  const titlesMatch = title1 === title2 || title1.includes(title2) || title2.includes(title1);
  
  // Check if authors match
  const authorsMatch = author1 === author2;

  return titlesMatch && authorsMatch;
};

// Modify the fetchBooks function to deduplicate results
export const fetchBooks = async (query: string): Promise<Book[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const response = await fetch(
      `${GOOGLE_BOOKS_API_URL}?q=${encodeURIComponent(query)}&maxResults=40`  // Increased maxResults since we'll be deduping
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data: GoogleBooksResponse = await response.json();

    if (!data.items) {
      return [];
    }

    // Process and clean the books first
    const processedBooks = data.items
      .filter(item => item.volumeInfo.title) // Remove items without titles
      .map(item => {
        const isbn = item.volumeInfo.industryIdentifiers?.find(
          id => id.type === 'ISBN_13' || id.type === 'ISBN_10'
        )?.identifier;

        return {
          id: item.id,
          title: item.volumeInfo.title.trim(),
          author: (item.volumeInfo.authors?.[0] || 'Unknown Author').trim(),
          thumbnail: item.volumeInfo.imageLinks?.thumbnail ? 
            item.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : null,
          description: item.volumeInfo.description?.trim(),
          isbn: isbn?.trim(),
        };
      });

    // Deduplicate books with improved logic
    const uniqueBooks = processedBooks.reduce((acc: Book[], current: Book) => {
      // Check if we already have this book
      const existingIndex = acc.findIndex(book => areDuplicateBooks(book, current));
      
      if (existingIndex === -1) {
        // No duplicate found, add the book
        return [...acc, current];
      }

      // We found a duplicate, decide which version to keep
      const existing = acc[existingIndex];
      const shouldReplace = (
        (current.isbn && !existing.isbn) || // Prefer books with ISBN
        (current.thumbnail && !existing.thumbnail) || // Prefer books with thumbnails
        (current.description && !existing.description) || // Prefer books with descriptions
        (current.author !== 'Unknown Author' && existing.author === 'Unknown Author') // Prefer books with known authors
      );

      if (shouldReplace) {
        acc[existingIndex] = current;
      }

      return acc;
    }, []);

    // Sort results with more detailed prioritization
    return uniqueBooks.sort((a, b) => {
      // First prioritize books with ISBNs
      if (a.isbn && !b.isbn) return -1;
      if (!a.isbn && b.isbn) return 1;

      // Then prioritize books with thumbnails
      if (a.thumbnail && !b.thumbnail) return -1;
      if (!a.thumbnail && b.thumbnail) return 1;

      // Then prioritize books with descriptions
      if (a.description && !b.description) return -1;
      if (!a.description && b.description) return 1;

      // Then prioritize books with known authors
      if (a.author !== 'Unknown Author' && b.author === 'Unknown Author') return -1;
      if (a.author === 'Unknown Author' && b.author !== 'Unknown Author') return 1;

      return 0;
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Helper function to get a single book by ID
export const fetchBookById = async (bookId: string): Promise<Book | null> => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API_URL}/${bookId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }

    const data = await response.json();
    const volumeInfo = data.volumeInfo;
    
    const isbn = volumeInfo.industryIdentifiers?.find(
      (id: { type: string }) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier;

    return {
      id: data.id,
      title: volumeInfo.title,
      author: volumeInfo.authors?.[0] || 'Unknown Author',
      thumbnail: volumeInfo.imageLinks?.thumbnail ? 
        volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : null,
      description: volumeInfo.description,
      isbn,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Helper function to sanitize book data before saving
export const sanitizeBookData = (book: Book): Book => {
  return {
    id: book.id,
    title: book.title || 'Untitled',
    author: book.author || 'Unknown Author',
    thumbnail: book.thumbnail || null,
    description: book.description || '',
    isbn: book.isbn || '',
  };
}; 