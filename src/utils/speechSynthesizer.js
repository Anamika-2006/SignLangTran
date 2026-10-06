// Web Speech API wrapper for Text-to-Speech synthesis
class SpeechController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.pitch = 1.0;
    this.rate = 1.0;
    this.volume = 1.0;
    this.isSpeaking = false;
    this.onStateChange = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (!this.selectedVoice && this.voices.length > 0) {
      // Prefer modern neural/natural voices or default English
      const preferred = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft'))) || this.voices[0];
      this.selectedVoice = preferred;
    }
  }

  getVoices() {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  setVoice(voiceName) {
    const v = this.voices.find(item => item.name === voiceName);
    if (v) this.selectedVoice = v;
  }

  speak(text, onStart, onEnd) {
    if (!this.synth || !text) return;

    this.stop(); // Stop any pending utterance

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onStateChange) this.onStateChange(true);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }
}

export const speech = new SpeechController();
