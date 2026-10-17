import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants';
import { getStoredSession } from '@/services/authApi';

export default function SplashScreen() {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.5));
  const [slideUpAnim] = useState(() => new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    const timer = setTimeout(() => {
      void getStoredSession().then((session) => {
        router.replace(session ? '/(tabs)' : '/login');
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, slideUpAnim]);

  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/tabIcons/bearlogo-transparent.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="PlayGrow gaming panda mascot"
        />

        {/* App Name */}
        <View style={styles.nameContainer}>
          <Text style={styles.namePlay}>Play</Text>
          <Text style={styles.nameGrow}>Grow</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Play Games · Track Progress{'\n'}Earn Rewards · Grow Together
        </Text>

      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <Text style={styles.loadingText}>Loading your gaming world...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primaryBg,
    top: -50,
    right: -80,
    opacity: 0.5,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryBgLight,
    bottom: 100,
    left: -60,
    opacity: 0.5,
  },
  bgCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primaryBg,
    bottom: -30,
    right: 30,
    opacity: 0.3,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 230,
    height: 230,
    marginBottom: Spacing.xl,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  namePlay: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  nameGrow: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: '700',
    color: Colors.primary,
  },
  tagline: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
  },
  loadingText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.tertiary,
  },
});
