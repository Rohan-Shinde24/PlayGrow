import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAppDispatch, useScreenInsets } from '@/hooks';
import { setLoggedIn, updateProfile } from '@/store/slices/userSlice';
import { Button } from './Button';
import { Input } from './Input';
import { Colors, Spacing, Typography } from '@/constants';

type AuthMode = 'login' | 'register';

interface AuthFormValues {
  username: string;
  email: string;
  identifier: string;
  password: string;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isRegister = mode === 'register';
  const dispatch = useAppDispatch();
  const { bottom, headerTop } = useScreenInsets();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    defaultValues: {  username: '', email: '', identifier: '', password: '' },
  });

  const onSubmit = (values: AuthFormValues) => {
    if (isRegister) {
      dispatch(updateProfile({
        username: values.username.trim(),
        email: values.email.trim(),
      }));
    } else {
      const identifier = values.identifier.trim();
      dispatch(updateProfile(
        identifier.includes('@')
          ? { email: identifier }
          : { username: identifier }
      ));
    }

    dispatch(setLoggedIn(true));
    router.replace('/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: headerTop, paddingBottom: bottom + Spacing['2xl'] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandBlock}>
          <View style={styles.mascotBadge}>
            <Image
              source={require('../../../assets/images/tabIcons/bearlogo-transparent.png')}
              style={styles.mascot}
              resizeMode="contain"
              accessibilityLabel="PlayGrow gaming panda mascot"
            />
          </View>
          <View style={styles.brand}>
            <Text style={styles.brandPlay}>Play</Text>
            <Text style={styles.brandGrow}>Grow</Text>
          </View>
        </View>
        <Text style={styles.title}>{isRegister ? 'Create your account' : 'Welcome back'}</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Sign up to get started.' : 'Sign in to continue to PlayGrow.'}
        </Text>

        {isRegister && (
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="Choose a username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                error={errors.username?.message}
                returnKeyType="next"
              />
            )}
          />
        )}

        {isRegister ? (
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                error={errors.email?.message}
                returnKeyType="next"
              />
            )}
          />
        ) : (
          <Controller
            control={control}
            name="identifier"
            rules={{
              required: 'Enter your username or email',
              validate: (value) =>
                value.trim().length >= 3 || 'Enter a valid username or email',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username or email"
                placeholder="Username or email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoComplete="username"
                keyboardType="email-address"
                textContentType="username"
                error={errors.identifier?.message}
                returnKeyType="next"
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoComplete={isRegister ? 'new-password' : 'password'}
              textContentType={isRegister ? 'newPassword' : 'password'}
              secureTextEntry
              error={errors.password?.message}
              returnKeyType="done"
            />
          )}
        />
        <Button
          title={isRegister ? 'Create Account' : 'Login'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
          size="lg"
          style={styles.submit}
        />
        <Text style={styles.switchPrompt}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <Text
            style={styles.switchLink}
            onPress={() => router.replace(isRegister ? '/login' : '/register')}
          >
            {isRegister ? 'Login' : 'Register'}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  mascotBadge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  mascot: {
    width: 136,
    height: 136,
  },
  brand: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  brandPlay: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '700',
  },
  brandGrow: {
    color: Colors.primary,
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '700',
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  demoNote: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xl,
  },
  submit: {
    marginTop: Spacing.sm,
  },
  switchPrompt: {
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: Typography.fontSize.md,
  },
  switchLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
