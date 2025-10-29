declare module 'react-speech-recognition' {
  export interface SpeechRecognitionHook {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  }

  export function useSpeechRecognition(): SpeechRecognitionHook;

  const SpeechRecognition: {
    startListening: (options?: { continuous?: boolean; language?: string }) => void;
    stopListening: () => void;
    abortListening: () => void;
  };

  export default SpeechRecognition;
}