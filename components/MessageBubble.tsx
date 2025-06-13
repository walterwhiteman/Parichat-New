import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <Text style={styles.username}>{message.sender}</Text>
      
      {message.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: message.imageUrl }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
      )}
      
      {message.text && (
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.text}
        </Text>
      )}
      
      <Text style={styles.timestamp}>{formattedTime}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');
const maxBubbleWidth = width * 0.75;

const styles = StyleSheet.create({
  container: {
    maxWidth: maxBubbleWidth,
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  currentUserContainer: {
    backgroundColor: colors.messageSent,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherUserContainer: {
    backgroundColor: colors.messageReceived,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.textSecondary,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: colors.white,
  },
  otherUserText: {
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  imageContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
