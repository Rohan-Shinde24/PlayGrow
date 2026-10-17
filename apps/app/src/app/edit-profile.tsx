import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector, useScreenInsets } from '@/hooks';
import { updateProfile } from '@/store/slices/userSlice';
import { Avatar, Button, Input, ScreenHeader } from '@/components';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants';

interface ProfileFormValues {
  username: string;
  email: string;
}

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { bottom } = useScreenInsets();
  const [avatar, setAvatar] = useState(user.avatar);
  const [isPicking, setIsPicking] = useState(false);

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

  const pickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Allow photo access to choose a profile photo.');
        return;
      }

      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Something went wrong', 'Could not open the photo library. Please try again.');
    } finally {
      setIsPicking(false);
    }
  };

  const removePhoto = () => {
    if (!avatar) return;
    Alert.alert('Remove photo', 'Remove your current profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setAvatar('') },
    ]);
  };

  const saveProfile = (values: ProfileFormValues) => {
    dispatch(
      updateProfile({
        username: values.username.trim(),
        email: values.email.trim(),
        avatar,
      })
    );
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
          showsVerticalScrollIndicator={false}
        >
          {/* Profile photo */}
          <View style={styles.photoSection}>
            <View style={styles.avatarWrapper}>
              <Avatar uri={avatar} name={user.name || user.username} size="xl" />
              <Pressable
                style={styles.cameraBadge}
                onPress={pickPhoto}
                disabled={isPicking}
                hitSlop={8}
              >
                <Ionicons name="camera" size={16} color={Colors.white} />
              </Pressable>
            </View>

            <View style={styles.photoActions}>
              <Button
                title={avatar ? 'Change Photo' : 'Upload Photo'}
                variant="outline"
                size="sm"
                onPress={pickPhoto}
                loading={isPicking}
                icon={<Ionicons name="image-outline" size={16} color={Colors.primary} />}
              />
              {!!avatar && (
                <Button
                  title="Remove"
                  variant="ghost"
                  size="sm"
                  onPress={removePhoto}
                  icon={<Ionicons name="trash-outline" size={16} color={Colors.error} />}
                  textStyle={styles.removeText}
                />
              )}
            </View>
            <Text style={styles.photoHint}>
              Pick a square image for best results. JPG or PNG.
            </Text>
          </View>

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
    gap: Spacing.lg,
  },
  photoSection: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  photoHint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  removeText: {
    color: Colors.error,
  },
  saveButton: {
    marginTop: Spacing.sm,
  },
});
