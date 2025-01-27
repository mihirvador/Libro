import { View, FlatList, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { Searchbar, List, ActivityIndicator, Text, Surface, IconButton, Portal, Snackbar, Button } from 'react-native-paper';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { fetchBooks } from '../services/apiService';
import { addBook, loadBooks } from '../utils/storage';
import debounce from 'lodash/debounce';
import { theme, commonStyles, spacing } from '../theme/theme';
import { Icon } from 'react-native-elements';

function SearchBooksScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [savedBookIds, setSavedBookIds] = useState(new Set());

  // Animate loading spinner
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: loading ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  // Load saved books when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadSavedBooks();
    }, [])
  );

  const loadSavedBooks = async () => {
    try {
      const books = await loadBooks();
      setSavedBookIds(new Set(books.map(book => book.id)));
    } catch (err) {
      console.error('Error loading saved books:', err);
    }
  };

  // Enhanced error handling for search
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setBooks([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await fetchBooks(query);
      
      if (!results || results.length === 0) {
        setError({
          type: 'NO_RESULTS',
          message: `No books found for "${query}"`
        });
        setBooks([]);
        return;
      }

      setBooks(results);
    } catch (err) {
      console.error('Search error:', err);
      setError({
        type: 'API_ERROR',
        message: getErrorMessage(err)
      });
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error) => {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }
    
    if (error.message.includes('429')) {
      return 'Too many requests. Please try again in a moment.';
    }
    
    if (error.message.includes('401')) {
      return 'Unable to access the book service. Please try again later.';
    }
    
    return 'Something went wrong while searching. Please try again.';
  };

  // Update debounced search to use new error handling
  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 500),
    []
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  // Render error state with retry option
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error.message}</Text>
      <Button 
        mode="contained" 
        onPress={() => handleSearch(searchQuery)}
        style={styles.retryButton}
      >
        Try Again
      </Button>
    </View>
  );

  const handleSaveBook = async (book) => {
    try {
      await addBook({
        ...book,
        dateAdded: new Date().toISOString(),
      });
      setSavedBookIds(prev => new Set([...prev, book.id]));
      setSnackbar({ 
        visible: true, 
        message: `"${book.title}" added to your library` 
      });
    } catch (err) {
      setSnackbar({ 
        visible: true, 
        message: 'Failed to save book' 
      });
      console.error(err);
    }
  };

  const renderItem = ({ item }) => {
    const isBookSaved = savedBookIds.has(item.id);

    return (
      <TouchableOpacity 
        style={styles.bookCard}
        onPress={() => navigation.navigate('BookDetails', { book: item })}
      >
        <View style={styles.bookInfo}>
          {item.thumbnail ? (
            <Image 
              source={{ uri: item.thumbnail }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
              <Icon name="book" size={24} color={theme.colors.primary} />
            </View>
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              {item.author}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={() => !isBookSaved && handleSaveBook(item)}
            style={[styles.addButton, isBookSaved && styles.addedButton]}
            labelStyle={[styles.addButtonLabel, isBookSaved && styles.addedButtonLabel]}
            disabled={isBookSaved}
          >
            {isBookSaved ? 'Added' : 'Add'}
          </Button>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search books..."
        onChangeText={handleSearchChange}
        value={searchQuery}
        style={[styles.searchBar, { margin: spacing.sm }]}
        onSubmitEditing={handleSearchSubmit}
      />

      {/* Animated loading overlay */}
      <Animated.View 
        style={[
          styles.loadingOverlay,
          {
            opacity: fadeAnim,
            // Hide the view completely when not loading
            display: loading ? 'flex' : 'none',
          }
        ]}
        pointerEvents={loading ? 'auto' : 'none'}
      >
        <Surface style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Searching books...</Text>
        </Surface>
      </Animated.View>

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {searchQuery.trim() 
              ? error ? error.message : 'Start typing to search for books'
              : 'Search for books to add to your library'
            }
          </Text>
        )}
        keyboardShouldPersistTaps="handled"
        onRefresh={handleSearchSubmit}
        refreshing={loading}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Portal>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ visible: false, message: '' })}
          duration={3000}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbar({ visible: false, message: '' }),
          }}
        >
          {snackbar.message}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    ...commonStyles.searchBar,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  bookCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2,
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderColor: theme.colors.outline,
    borderWidth: 1,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 75,
    borderRadius: theme.roundness,
  },
  placeholderThumbnail: {
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurface,
  },
  author: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurfaceVariant,
  },
  addButton: {
    backgroundColor: theme.colors.lightGreen,
    borderRadius: theme.roundness,
    minWidth: 72,
  },
  addedButton: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  addButtonLabel: {
    ...theme.fonts.labelLarge,
    color: theme.colors.onPrimary,
  },
  addedButtonLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  separator: {
    height: spacing.xs,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${theme.colors.surface}CC`,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingContainer: {
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: theme.roundness,
    borderColor: theme.colors.overlay,
    borderWidth: 1,
  },
  loadingText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    textAlign: 'center',
    color: theme.colors.error,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
  },
});

export default SearchBooksScreen; 