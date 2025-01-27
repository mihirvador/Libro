import { View, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Button, List, Text, FAB, ActivityIndicator, Surface, Icon, IconButton } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { loadBooks, deleteBook } from '../utils/storage';
import { commonStyles, spacing, theme, palette } from '../theme/theme';
import BookLogo from '../components/BookLogo';

function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace useEffect with useFocusEffect to reload books when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadStoredBooks();
    }, [])
  );

  const loadStoredBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedBooks = await loadBooks();
      setBooks(storedBooks);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const updatedBooks = await deleteBook(bookId);
      if (updatedBooks) {
        setBooks(updatedBooks);
      }
    } catch (err) {
      console.error('Failed to delete book:', err);
      // Optionally show an error message to the user
    }
  };

  const handleLongPress = (book) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to remove "${book.title}" from your library?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteBook(book.id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.bookCard} elevation={1}>
      <View style={styles.bookCardInner}>
        <TouchableOpacity 
          style={styles.bookContent}
          onPress={() => navigation.navigate('BookDetails', { book: item })}
          onLongPress={() => handleLongPress(item)}
          delayLongPress={500}
        >
          {item.thumbnail ? (
            <Image 
              source={{ uri: item.thumbnail }} 
              style={styles.thumbnail}
            />
          ) : (
            <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
              <Icon name="book" size={24} color={theme.colors.primary} />
            </View>
          )}
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {item.author}
            </Text>
            <Text style={styles.bookDate}>
              Added {new Date(item.dateAdded).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Hold to delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Surface>
  );

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Surface style={styles.emptyStateCard}>
        <BookLogo size={120} color={theme.colors.primary} />
        <Text style={styles.emptyStateTitle}>
          Your Library is Empty
        </Text>
        <Text style={styles.emptyStateDescription}>
          Start building your personal book collection by adding books you love or want to read.
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('SearchBooks')}
          style={[styles.emptyStateButton, commonStyles.button]}
          contentStyle={styles.emptyStateButtonContent}
          labelStyle={styles.emptyStateButtonLabel}
          buttonColor={palette.lightGreen}
        >
          Add Your First Book
        </Button>
        <Text style={styles.emptyStateHint}>
          Search for books by title, author, or ISBN
        </Text>
      </Surface>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={loadStoredBooks}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        />
      ) : (
        <EmptyState />
      )}
      
      <FAB
        icon="plus"
        style={commonStyles.fab}
        onPress={() => navigation.navigate('SearchBooks')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  bookCard: {
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs / 2,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  bookCardInner: {
    borderRadius: theme.roundness,
  },
  bookContent: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: theme.roundness,
    marginRight: spacing.md,
  },
  placeholderThumbnail: {
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurface,
  },
  bookAuthor: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurfaceVariant,
  },
  bookDate: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  emptyStateCard: {
    padding: spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness * 2,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  emptyStateTitle: {
    ...theme.fonts.headlineMedium,
    color: theme.colors.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textAlign: 'center',
    opacity: 0.9,
  },
  emptyStateDescription: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onSurface,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  emptyStateButton: {
    marginVertical: spacing.lg,
    borderRadius: theme.roundness * 2,
    width: '100%',
    height: 56,
  },
  emptyStateButtonContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButtonLabel: {
    ...theme.fonts.titleMedium,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  emptyStateHint: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    marginTop: spacing.md,
  },
  hintContainer: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.sm,
  },
  hintText: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurface,
    opacity: 0.5,
    fontSize: 10,
  },
});

export default HomeScreen; 