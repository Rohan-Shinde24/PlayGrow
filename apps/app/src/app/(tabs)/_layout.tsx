import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useScreenInsets, TAB_BAR_HEIGHT } from '@/hooks';
import { Colors, Typography, Spacing } from '@/constants';

export default function TabLayout() {
  const { bottom } = useScreenInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: Colors.tab.active,
        tabBarInactiveTintColor: Colors.tab.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: TAB_BAR_HEIGHT + bottom,
            paddingTop: Spacing.sm,
            paddingBottom: bottom + Spacing.sm,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-games"
        options={{
          tabBarLabel: 'My Games',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'gift' : 'gift-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  tabLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
  },
});
