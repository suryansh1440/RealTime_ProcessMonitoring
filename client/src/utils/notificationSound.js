// Create audio context and oscillator for notification sound
let audioContext = null;
let oscillator = null;
let gainNode = null;

export const playNotificationSound = () => {
  try {
    // Create audio context if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create oscillator and gain nodes
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1); // A4 note

    // Configure gain node for volume control
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start and stop oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    // Clean up
    oscillator.onended = () => {
      oscillator = null;
      gainNode = null;
    };
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Clean up function
export const cleanupNotificationSound = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator = null;
  }
  if (gainNode) {
    gainNode = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}; 