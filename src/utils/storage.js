import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKS_STORAGE_KEY = '@MyBookList:books';

export const saveBooks = async (books) => {
  try {
    await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving books:', error);
  }
};

export const loadBooks = async () => {
  try {
    const booksJson = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
    return booksJson ? JSON.parse(booksJson) : [];
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
};

export const addBook = async (book) => {
  try {
    const books = await loadBooks();
    if (books.some(b => b.id === book.id)) {
      throw new Error('Book already exists in library');
    }
    const updatedBooks = [...books, book];
    await saveBooks(updatedBooks);
    return true;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const updateBook = async (updatedBook) => {
  try {
    const books = await loadBooks();
    const newBooks = books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    await saveBooks(newBooks);
    return newBooks;
  } catch (error) {
    console.error('Error updating book:', error);
    return null;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const books = await loadBooks();
    const newBooks = books.filter(book => book.id !== bookId);
    await saveBooks(newBooks);
    return newBooks;
  } catch (error) {
    console.error('Error deleting book:', error);
    return null;
  }
};

export const updateBookComments = async (bookId, comments) => {
  try {
    const books = await loadBooks();
    const updatedBooks = books.map(book => 
      book.id === bookId 
        ? { ...book, comments, lastEdited: new Date().toISOString() }
        : book
    );
    await saveBooks(updatedBooks);
    return updatedBooks;
  } catch (error) {
    console.error('Error updating book comments:', error);
    return null;
  }
};

export const isBookSaved = async (bookId) => {
  try {
    const books = await loadBooks();
    return books.some(book => book.id === bookId);
  } catch (error) {
    console.error('Error checking if book exists:', error);
    return false;
  }
}; 