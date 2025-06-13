import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { User } from '@/types/chat';
import { Video, Phone, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useChatStore } from '@/store/chatStore';

interface ChatHeaderProps {
  partner: User | null;
  onVideoCall?: () => void;
}

export const ChatHeader = ({ partner, onVideoCall }: ChatHeaderProps) => {
  const router = useRouter();
  const leaveRoom = useChatStore((state) => state.leaveRoom);

  const handleLeaveRoom = () => {
    leaveRoom();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.appName}>Parichat</Text>
      </View>
      
      <View style={styles.centerSection}>
        {partner && (
          <View style={styles.userInfo}>
            <Text style={styles.username}>{partner.username}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot,
                partner.isOnline ? styles.onlineDot : styles.offlineDot
              ]} />
              <Text style={styles.statusText}>
                {partner.isOnline 
                  ? `${partner.username} is online` 
                  : partner.lastSeen 
                    ? `Last seen ${new Date(partner.lastSeen).toLocaleTimeString()}` 
                    : 'Offline'
                }
              </Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onVideoCall}
        >
          <Video size={22} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleLeaveRoom}
        >
          <LogOut size={22} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineDot: {
    backgroundColor: colors.online,
  },
  offlineDot: {
    backgroundColor: colors.offline,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  iconButton: {
    padding: 8,
  },
});
