import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddBookScreen from '../screens/AddBookScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import SearchBooksScreen from '../screens/SearchBooksScreen';
import { theme, palette, spacing } from '../theme/theme';
import BookLogo from '../components/BookLogo';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: palette.overlay,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          ...theme.fonts.titleLarge,
          color: theme.colors.onSurface,
        },
        headerLeft: ({ tintColor }) => (
          <View style={{ marginLeft: spacing.sm }}>
            <BookLogo size={32} color={theme.colors.primary} />
          </View>
        ),
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'My Books' }}
      />
      <Stack.Screen 
        name="AddBook" 
        component={AddBookScreen} 
        options={{ title: 'Add New Book' }}
      />
      <Stack.Screen 
        name="BookDetails" 
        component={BookDetailsScreen} 
        options={({ navigation }) => ({
          title: 'Animal Farm',
          headerLeft: (props) => (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              iconColor={theme.colors.onSurface}
            />
          ),
          headerRight: (props) => (
            <IconButton
              icon="pencil"
              size={24}
              onPress={() => {}}
              iconColor={theme.colors.onSurface}
            />
          ),
        })}
      />
      <Stack.Screen 
        name="SearchBooks" 
        component={SearchBooksScreen} 
        options={{
          title: 'Search Books',
          headerLeft: (props) => (
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              iconColor={theme.colors.onSurface}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator; 