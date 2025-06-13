import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useChatStore } from '@/store/chatStore';
import { Message, User } from '@/types/chat';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatHeader } from '@/components/ChatHeader';
import { MessageInput } from '@/components/MessageInput';
import { VideoCallModal } from '@/components/VideoCallModal';
import * as Haptics from 'expo-haptics';

// Mock partner responses
const mockResponses = [
  "Hey there! How are you doing today?",
  "That's interesting! Tell me more.",
  "I'm not sure I understand. Could you explain?",
  "Haha, that's funny! 😄",
  "I've been thinking about that too.",
  "Let's talk about something else.",
  "Do you have any plans for the weekend?",
  "I miss our conversations.",
  "What do you think about the new movie that just came out?",
  "I'm a bit busy right now, but I'll get back to you soon.",
];

export default function ChatScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const { currentUser, roomCode, messages, addMessage } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);
  const [partner, setPartner] = useState<User | null>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  // Simulate partner joining
  useEffect(() => {
    if (!currentUser || !roomCode) {
      router.replace('/');
      return;
    }
    
    // Simulate loading and partner joining
    const timer = setTimeout(() => {
      const mockPartner: User = {
        username: 'Partner',
        isOnline: true,
      };
      
      setPartner(mockPartner);
      setIsLoading(false);
      
      // Send welcome message from partner
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `Hey ${currentUser.username}! Welcome to our private chat room.`,
        sender: mockPartner.username,
        timestamp: Date.now(),
      };
      
      addMessage(welcomeMessage);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [currentUser, roomCode]);
  
  const handleSendMessage = (text: string, imageUrl?: string) => {
    if (!currentUser) return;
    
    // Trigger haptic feedback on send
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Create and add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: currentUser.username,
      timestamp: Date.now(),
      imageUrl,
    };
    
    addMessage(newMessage);
    
    // Simulate partner typing and response
    setTimeout(() => {
      if (partner) {
        // Randomly select a response
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        const partnerMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: partner.username,
          timestamp: Date.now(),
          // Occasionally send an image back
          imageUrl: Math.random() > 0.8 
            ? 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' 
            : undefined,
        };
        
        addMessage(partnerMessage);
      }
    }, 1000 + Math.random() * 2000);
  };
  
  const handleVideoCall = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsVideoCallActive(true);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader 
        partner={partner} 
        onVideoCall={handleVideoCall}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble 
              message={item} 
              isCurrentUser={currentUser?.username === item.sender}
            />
          )}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
        
        <MessageInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
      
      {/* Video call component - now renders differently when minimized */}
      <VideoCallModal
        visible={isVideoCallActive}
        onClose={() => setIsVideoCallActive(false)}
        partner={partner}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
});
