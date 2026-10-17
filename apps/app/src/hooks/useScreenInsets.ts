import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '../constants';

/**
 * Height of the tab bar content (icons + labels), excluding the bottom
 * safe-area inset which is added on top of it.
 */
export const TAB_BAR_HEIGHT = 60;

/**
 * Safe-area aware spacing helpers.
 *
 * `headerTop` keeps a fixed screen header clear of the status bar / notch while
 * still leaving breathing room on devices without a top inset (Android, web).
 *
 * `contentBottom` keeps the last item of a scroll view clear of the home
 * indicator on gesture-navigation devices.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    headerTop: Math.max(insets.top, Spacing.md) + Spacing.sm,
    contentBottom: Math.max(insets.bottom, Spacing.md) + Spacing.lg,
  };
}
