import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions,
  Platform,
  PanResponder,
  Animated,
} from 'react-native';
import { colors } from '@/constants/colors';
import { Mic, MicOff, Camera, CameraOff, PhoneOff } from 'lucide-react-native';
import { User } from '@/types/chat';

interface VideoCallModalProps {
  visible: boolean;
  onClose: () => void;
  partner: User | null;
}

export const VideoCallModal = ({ 
  visible, 
  onClose,
  partner,
}: VideoCallModalProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // For draggable minimized view
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => isMinimized,
      onPanResponderGrant: () => {
        // Store the current position as offset
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // Flatten the offset into the base value
        pan.flattenOffset();
      }
    })
  ).current;

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    // Reset position when maximizing
    if (isMinimized) {
      pan.setValue({ x: 0, y: 0 });
    }
  };

  if (!visible) return null;

  // When minimized, render a draggable floating view instead of a modal
  if (isMinimized) {
    return (
      <Animated.View
        style={[
          styles.minimizedContainer,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.minimizedContent}>
          <View style={styles.minimizedPartnerVideo}>
            <Text style={styles.minimizedVideoText}>
              {partner?.username || "Partner"}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.minimizedControls}
            onPress={toggleMinimize}
          >
            <Text style={styles.expandText}>Expand</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.minimizedEndCall}
            onPress={onClose}
          >
            <PhoneOff size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  // Full screen modal when not minimized
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.videoContainer}>
          {/* This would be replaced with actual video components */}
          <View style={styles.partnerVideo}>
            <Text style={styles.videoPlaceholderText}>
              {partner?.username || "Partner"}'s Video
            </Text>
          </View>
          
          <View style={styles.selfVideo}>
            <Text style={styles.videoPlaceholderText}>Your Video</Text>
          </View>
          
          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.activeControlButton]} 
              onPress={toggleMute}
            >
              {isMuted ? (
                <MicOff size={24} color={colors.white} />
              ) : (
                <Mic size={24} color={colors.white} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.endCallButton]} 
              onPress={onClose}
            >
              <PhoneOff size={24} color={colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, !isCameraOn && styles.activeControlButton]} 
              onPress={toggleCamera}
            >
              {isCameraOn ? (
                <Camera size={24} color={colors.white} />
              ) : (
                <CameraOff size={24} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.minimizeButton}
            onPress={toggleMinimize}
          >
            <Text style={styles.minimizeButtonText}>Minimize</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: colors.black,
    position: 'relative',
  },
  minimizedContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 150,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 1000,
    backgroundColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  minimizedContent: {
    flex: 1,
    position: 'relative',
  },
  minimizedPartnerVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizedVideoText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  minimizedControls: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expandText: {
    color: colors.white,
    fontSize: 12,
  },
  minimizedEndCall: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.error,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  videoPlaceholderText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  callControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlButton: {
    backgroundColor: colors.gray,
  },
  endCallButton: {
    backgroundColor: colors.error,
  },
  minimizeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  minimizeButtonText: {
    color: colors.white,
    fontSize: 12,
  },
});
