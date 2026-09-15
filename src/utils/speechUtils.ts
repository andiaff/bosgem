// Web Speech Audio Helper for Indonesian Affiliate Voiceover

export interface VoicePlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  activePromptKey: string | null;
  activeSceneIndex: number;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

// Find best Indonesian female voice or fallback
export function getIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  
  // Look for Indonesian voices
  const idVoices = voices.filter((v) => v.lang === "id-ID" || v.lang.startsWith("id"));
  if (idVoices.length > 0) {
    // Prefer female names if indicated
    const femaleVoice = idVoices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("gadis") ||
        v.name.toLowerCase().includes("wanita") ||
        v.name.toLowerCase().includes("putri") ||
        v.name.toLowerCase().includes("siti") ||
        v.name.toLowerCase().includes("dewi")
    );
    return femaleVoice || idVoices[0];
  }
  return null;
}

export function playFullPromptAudio({
  scenes,
  promptKey,
  speed = 1.25,
  pitch = 1.15,
  onSceneChange,
  onFinish,
  onError,
}: {
  scenes: { vo: string; time: string }[];
  promptKey: string;
  speed?: number;
  pitch?: number;
  onSceneChange: (index: number) => void;
  onFinish: () => void;
  onError?: (err: any) => void;
}): () => void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    if (onError) onError(new Error("Browser tidak mendukung SpeechSynthesis."));
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  let currentIndex = 0;
  let isCancelled = false;

  const playNextScene = () => {
    if (isCancelled || currentIndex >= scenes.length) {
      onFinish();
      return;
    }

    const scene = scenes[currentIndex];
    onSceneChange(currentIndex);

    const utterance = new SpeechSynthesisUtterance(scene.vo);
    currentUtterance = utterance;
    utterance.lang = "id-ID";
    utterance.rate = speed; // Energetic affiliate tempo
    utterance.pitch = pitch; // Young female energetic pitch

    const voice = getIndonesianVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      currentIndex++;
      // Brief 150ms natural breath between scenes
      setTimeout(() => {
        playNextScene();
      }, 150);
    };

    utterance.onerror = (e) => {
      if (!isCancelled) {
        console.warn("Speech error or interruption:", e);
        currentIndex++;
        playNextScene();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  playNextScene();

  // Return stop function
  return () => {
    isCancelled = true;
    window.speechSynthesis.cancel();
    onFinish();
  };
}

export function stopAllSpeech(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
