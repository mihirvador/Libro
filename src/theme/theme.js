import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Add standardized spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Export the palette so it can be used in other files
export const palette = {
  // Primary colors
  lightGreen: '#A8D5BA', // Primary color
  darkGreen: '#7BB38B', // Accent color
  paleGreen: '#E5F1EA', // Light variant
  
  // Background colors
  cream: '#FDF6E3', // Main background
  lightCream: '#FFFDF8', // Surface color
  
  // Supporting colors
  warmGray: '#4A4A4A',
  lightGray: '#8A8A8A',
  error: '#D97373', // Softer red to match the pastel theme
  success: '#90C9A7',
  
  // Transparent variants for overlays
  overlay: 'rgba(168, 213, 186, 0.08)', // Based on lightGreen
  shadow: 'rgba(123, 179, 139, 0.12)', // Based on darkGreen
};

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({config: fontConfig}),
  colors: {
    ...MD3LightTheme.colors,
    // Main colors
    primary: palette.lightGreen,
    primaryContainer: palette.paleGreen,
    secondary: palette.darkGreen,
    secondaryContainer: palette.paleGreen,
    
    // Backgrounds
    background: palette.cream,
    surface: palette.lightCream,
    surfaceVariant: palette.paleGreen,
    
    // Content colors
    onPrimary: palette.warmGray,
    onSecondary: palette.warmGray,
    onSurface: palette.warmGray,
    onBackground: palette.warmGray,
    onSurfaceVariant: palette.lightGray,
    
    // Status colors
    error: palette.error,
    success: palette.success,
    
    // Elevation levels with new colors
    elevation: {
      level0: 'transparent',
      level1: palette.lightCream,
      level2: palette.cream,
      level3: palette.paleGreen,
      level4: palette.overlay,
      level5: palette.shadow,
    },
  },
  roundness: 12,
};

// Updated common styles with new color scheme
export const commonStyles = {
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: spacing.md,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    marginBottom: spacing.sm,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  title: {
    ...theme.fonts.titleLarge,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...theme.fonts.titleMedium,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  body: {
    ...theme.fonts.bodyMedium,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  searchBar: {
    margin: spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  button: {
    borderRadius: theme.roundness,
    marginVertical: spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  icon: {
    color: theme.colors.primary,
  },
  divider: {
    backgroundColor: palette.overlay,
    marginVertical: spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: palette.overlay,
    borderWidth: 1,
  },
}; 