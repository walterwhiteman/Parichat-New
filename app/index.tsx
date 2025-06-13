import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useChatStore } from '@/store/chatStore';
import { User } from '@/types/chat';
import { Lock, MessageCircle, User as UserIcon } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [errors, setErrors] = useState({ username: '', roomCode: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { setCurrentUser, setRoomCode: storeSetRoomCode } = useChatStore();
  
  // Check if user already has a username stored
  const currentUser = useChatStore((state) => state.currentUser);
  
  useEffect(() => {
    if (currentUser?.username) {
      setUsername(currentUser.username);
    }
  }, [currentUser]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', roomCode: '' };
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }
    
    if (!roomCode.trim()) {
      newErrors.roomCode = 'Room code is required';
      isValid = false;
    } else if (roomCode.length < 4) {
      newErrors.roomCode = 'Room code must be at least 4 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleJoinRoom = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user: User = {
        username,
        isOnline: true,
      };
      
      setCurrentUser(user);
      storeSetRoomCode(roomCode);
      
      // Navigate to chat screen
      router.replace('/chat');
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <MessageCircle size={48} color={colors.primary} />
              <Text style={styles.title}>Parichat</Text>
              <Text style={styles.subtitle}>Private chat for two</Text>
            </View>
            
            <View style={styles.formContainer}>
              <Input
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                leftIcon={<UserIcon size={20} color={colors.gray} />}
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <Input
                label="Room Code"
                placeholder="Enter room code"
                value={roomCode}
                onChangeText={setRoomCode}
                error={errors.roomCode}
                leftIcon={<Lock size={20} color={colors.gray} />}
                autoCapitalize="none"
                autoCorrect={false}
              />
              
              <Button
                title="Join Room"
                onPress={handleJoinRoom}
                loading={isLoading}
                style={styles.button}
              />
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Only two people can join a room at once.
              </Text>
              <Text style={styles.footerText}>
                Your messages are not stored on any server.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});
