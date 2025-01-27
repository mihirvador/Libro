import { View } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addBook } from '../utils/storage';

function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !author.trim()) {
      setError('Title and author are required');
      return;
    }

    try {
      setLoading(true);
      const newBook = {
        title: title.trim(),
        author: author.trim(),
        comments: comments.trim(),
        dateAdded: new Date().toISOString(),
      };

      const updatedBooks = await addBook(newBook);
      if (updatedBooks) {
        navigation.goBack();
      }
    } catch (err) {
      setError('Failed to save book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Book Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 16 }}
        error={error && !title.trim()}
      />
      <TextInput
        label="Author"
        mode="outlined"
        value={author}
        onChangeText={setAuthor}
        style={{ marginBottom: 16 }}
        error={error && !author.trim()}
      />
      <TextInput
        label="Comments"
        mode="outlined"
        value={comments}
        onChangeText={setComments}
        style={{ marginBottom: 16 }}
        multiline
        numberOfLines={4}
      />
      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : null}
      <Button 
        mode="contained" 
        onPress={handleSave}
        loading={loading}
        disabled={loading}
      >
        Save Book
      </Button>
    </View>
  );
}

export default AddBookScreen; 