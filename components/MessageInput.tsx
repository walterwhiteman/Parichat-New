import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  KeyboardAvoidingView,
  Text,
  Image,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Send, Paperclip } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface MessageInputProps {
  onSendMessage: (text: string, imageUri?: string) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleSend = () => {
    if (message.trim() || imageUri) {
      onSendMessage(message, imageUri || undefined);
      setMessage('');
      setImageUri(null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.removeImageText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Paperclip size={22} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!message.trim() && !imageUri) ? styles.sendButtonDisabled : null
            ]}
            onPress={handleSend}
            disabled={!message.trim() && !imageUri}
          >
            <Send size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 12,
    color: colors.textPrimary,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    width: 100,
    height: 100,
    marginLeft: 12,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
