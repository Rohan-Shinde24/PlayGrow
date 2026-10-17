import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector, useScreenInsets } from '@/hooks';
import { updateProfile } from '@/store/slices/userSlice';
import { Button, Input, ScreenHeader } from '@/components';
import { Colors, Spacing } from '@/constants';

interface ProfileFormValues {
  username: string;
  email: string;
}

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { bottom } = useScreenInsets();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  const saveProfile = (values: ProfileFormValues) => {
    dispatch(updateProfile({
      username: values.username.trim(),
      email: values.email.trim(),
    }));
    Alert.alert('Profile updated', 'Your profile changes have been saved.');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit Profile" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: bottom + Spacing['2xl'] }]}
          keyboardShouldPersistTaps="handled"
        >
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
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                error={errors.email?.message}
                returnKeyType="done"
              />
            )}
          />
          <Button
            title="Save Changes"
            onPress={handleSubmit(saveProfile)}
            loading={isSubmitting}
            fullWidth
            size="lg"
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  saveButton: {
    marginTop: Spacing.sm,
  },
});
