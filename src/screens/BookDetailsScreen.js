import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { Text, Divider, Surface, IconButton, TextInput, Button, Portal, Dialog } from 'react-native-paper';
import { commonStyles, spacing, theme, palette } from '../theme/theme';
import { updateBookComments, addBook, loadBooks, deleteBook, isBookSaved as checkBookSaved } from '../utils/storage';
import { Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';

function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState(book?.comments || '');
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [isBookSaved, setIsBookSaved] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      setSnackbar({ 
        visible: true, 
        message: `"${book.title}" removed from your library` 
      });
      if (navigation.canGoBack()) {
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1500);
      }
    } catch (err) {
      setSnackbar({ 
        visible: true, 
        message: 'Failed to delete book' 
      });
      console.error(err);
    }
  };

  const handleDeleteConfirmation = () => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to remove "${book.title}" from your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const updateNavigationOptions = useCallback((isSaved) => {
    navigation.setOptions({
      title: book.title,
      headerRight: () => (
        isSaved ? (
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="delete"
              iconColor={theme.colors.error}
              onPress={handleDeleteConfirmation}
            />
            <IconButton
              icon="pencil"
              onPress={() => setIsEditing(true)}
            />
          </View>
        ) : (
          <IconButton
            icon="pencil"
            onPress={() => setIsEditing(true)}
          />
        )
      ),
    });
  }, [navigation, book.title]);

  const checkIfBookSaved = useCallback(async () => {
    if (!book?.id) return;
    
    try {
      const isSaved = await checkBookSaved(book.id);
      setIsBookSaved(isSaved);
      updateNavigationOptions(isSaved);
    } catch (err) {
      console.error('Error checking if book is saved:', err);
    }
  }, [book?.id, updateNavigationOptions]);

  useEffect(() => {
    checkIfBookSaved();
  }, [checkIfBookSaved]);

  useFocusEffect(
    useCallback(() => {
      checkIfBookSaved();
    }, [checkIfBookSaved])
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const result = await updateBookComments(book.id, comments);
      if (result) {
        setIsEditing(false);
      } else {
        setError('Failed to save changes');
      }
    } catch (err) {
      setError('An error occurred while saving');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBook = async (book) => {
    try {
      const isSaved = await checkBookSaved(book.id);
      if (isSaved) {
        setSnackbar({ 
          visible: true, 
          message: `"${book.title}" is already in your library` 
        });
        setIsBookSaved(true);
        return;
      }

      await addBook({
        ...book,
        dateAdded: new Date().toISOString(),
      });
      setIsBookSaved(true);
      setSnackbar({ 
        visible: true, 
        message: `"${book.title}" added to your library` 
      });
    } catch (err) {
      setSnackbar({ 
        visible: true, 
        message: err.message || 'Failed to save book' 
      });
      console.error(err);
    }
  };

  if (!book) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <Text style={styles.error}>Book information not available</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={commonStyles.screen}>
        <Surface style={styles.container}>
          {book.thumbnail && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: book.thumbnail }} 
                style={styles.thumbnail}
                resizeMode="contain"
              />
            </View>
          )}

          <Text variant="headlineMedium" style={styles.title}>
            {book.title}
          </Text>
          
          <Text variant="titleMedium" style={styles.author}>
            by {book.author}
          </Text>

          <Divider style={styles.divider} />

          {book.description && (
            <Text style={styles.description}>
              {book.description}
            </Text>
          )}

          <Divider style={styles.divider} />

          <View style={styles.commentsSection}>
            <Text variant="titleMedium" style={styles.commentsTitle}>
              Notes & Comments
            </Text>
            <Text style={styles.commentsHint}>
              Tap the edit button to add your thoughts about this book
            </Text>
            <Text style={styles.comments}>
              {comments || 'No comments yet'}
            </Text>
          </View>
        </Surface>
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => !isBookSaved && handleAddBook(book)}
        style={[
          styles.addButton,
          isBookSaved && styles.addedButton
        ]}
        labelStyle={[
          styles.addButtonLabel,
          isBookSaved && styles.addedButtonLabel
        ]}
        icon={isBookSaved ? "check" : "plus"}
        disabled={isBookSaved}
        contentStyle={styles.buttonContent}
      >
        {isBookSaved ? 'Added to Books' : 'Add to Books'}
      </Button>

      <Portal>
        <Dialog visible={isEditing} onDismiss={() => setIsEditing(false)}>
          <Dialog.Title>Edit Comments</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              value={comments}
              onChangeText={setComments}
              multiline
              numberOfLines={4}
              placeholder="Add your thoughts about this book..."
              style={styles.input}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsEditing(false)}>Cancel</Button>
            <Button 
              mode="contained" 
              onPress={handleSave}
              loading={isSaving}
              disabled={isSaving}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: 200,
    height: 300,
    borderRadius: theme.roundness,
  },
  title: {
    ...theme.fonts.headlineMedium,
    color: theme.colors.onSurface,
  },
  author: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: spacing.md,
  },
  description: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  error: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.error,
    textAlign: 'center',
  },
  commentsSection: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.roundness,
  },
  commentsTitle: {
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  commentsHint: {
    ...theme.fonts.bodySmall,
    color: theme.colors.onSurface,
    opacity: 0.7,
    marginBottom: spacing.sm,
  },
  comments: {
    ...theme.fonts.bodyLarge,
    color: theme.colors.onSurface,
    lineHeight: 24,
  },
  input: {
    ...commonStyles.input,
    backgroundColor: theme.colors.surface,
  },
  errorText: {
    ...theme.fonts.bodySmall,
    color: theme.colors.error,
    marginTop: spacing.xs,
  },
  addButton: {
    borderRadius: theme.roundness * 2,
    backgroundColor: palette.lightGreen,
    margin: spacing.md,
  },
  buttonContent: {
    height: 48,
    paddingHorizontal: spacing.lg,
  },
  addedButton: {
    backgroundColor: theme.colors.surfaceVariant,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  addButtonLabel: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  addedButtonLabel: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
  },
});

export default BookDetailsScreen; 