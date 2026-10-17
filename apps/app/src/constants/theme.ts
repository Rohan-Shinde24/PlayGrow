/**
 * PlayGrow design tokens.
 *
 * The palette is intentionally a little "darker" and more muted than a typical
 * bright kids-app green so cards, headers and the tab bar feel professional.
 */
export const Colors = {
  primary: '#1B7F3B',
  primaryLight: '#2E9E52',
  primaryDark: '#0F5C29',
  primaryBg: '#E6F3EA',
  primaryBgLight: '#F0F8F2',

  secondary: '#D98612',
  secondaryLight: '#EFA83F',
  secondaryDark: '#A96507',
  secondaryBg: '#FCF1E0',

  accent: '#1F6FD0',
  accentLight: '#4A93EE',
  accentBg: '#E7F0FC',

  success: '#1B7F3B',
  warning: '#D98612',
  error: '#CF3A32',
  errorBg: '#FCEAE9',
  info: '#1F6FD0',

  white: '#FFFFFF',
  black: '#000000',
  background: '#F1F4F2',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFCFA',
  surfaceSunken: '#E8EDEA',

  text: {
    primary: '#0E1812',
    secondary: '#48554E',
    tertiary: '#75827B',
    inverse: '#FFFFFF',
    accent: '#1B7F3B',
  },

  border: '#D5DDD8',
  borderLight: '#E5EBE7',
  divider: '#DCE3DE',

  overlay: 'rgba(8, 20, 13, 0.55)',
  shadow: 'rgba(8, 20, 13, 0.10)',

  gradient: {
    primary: ['#1B7F3B', '#2E9E52'] as const,
    primaryDeep: ['#0F5C29', '#1B7F3B'] as const,
    secondary: ['#D98612', '#EFA83F'] as const,
    accent: ['#1F6FD0', '#4A93EE'] as const,
    dark: ['#0E1812', '#22322A'] as const,
    card: ['#FFFFFF', '#F1F4F2'] as const,
    green: ['#167033', '#2E9E52'] as const,
  },

  tab: {
    active: '#1B7F3B',
    inactive: '#8B968F',
  },

  streak: {
    active: '#1B7F3B',
    inactive: '#DFE6E1',
  },

  badge: {
    red: '#CF3A32',
    green: '#1B7F3B',
    blue: '#1F6FD0',
    orange: '#D98612',
    purple: '#7A3FBF',
  },
};

/** Canonical icon colors so every screen uses the same tonal mapping. */
export const IconColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  accent: Colors.accent,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  muted: Colors.text.tertiary,
  onDark: Colors.white,
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 40,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 28,
    '3xl': 32,
    '4xl': 36,
    '5xl': 40,
    '6xl': 48,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
