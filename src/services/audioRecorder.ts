export class DualChannelAudioRecorder {
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private agentGain: GainNode | null = null;
  private destNode: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private analyser: AnalyserNode | null = null;

  async start(onDataAvailable?: (blob: Blob) => void): Promise<boolean> {
    try {
      this.audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Request mic permission
      this.micStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      this.destNode = this.audioCtx.createMediaStreamDestination();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;

      // Connect mic to destination & analyser
      this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);
      this.micSource.connect(this.destNode);
      this.micSource.connect(this.analyser);

      // Create an agent gain node connected to destination and speakers
      this.agentGain = this.audioCtx.createGain();
      this.agentGain.gain.value = 1.0;
      this.agentGain.connect(this.destNode);
      this.agentGain.connect(this.audioCtx.destination);

      this.recordedChunks = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      this.mediaRecorder = new MediaRecorder(this.destNode.stream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
          onDataAvailable?.(event.data);
        }
      };

      this.mediaRecorder.start(250); // Slice every 250ms
      this.isRecording = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or audio setup failed:', err);
      return false;
    }
  }

  // Route agent audio through recorder so both speakers are captured in the recording
  routeAgentAudioElement(audioEl: HTMLAudioElement) {
    if (!this.audioCtx || !this.agentGain) return;
    try {
      const source = this.audioCtx.createMediaElementSource(audioEl);
      source.connect(this.agentGain);
    } catch {
      // Element might already be connected
    }
  }

  // Play audio buffer through agent gain node for synthesized audio
  playAgentBuffer(buffer: AudioBuffer) {
    if (!this.audioCtx || !this.agentGain) return;
    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.agentGain);
    source.start();
  }

  getAudioLevel(): number {
    if (!this.analyser) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    return Math.min(100, Math.round((avg / 255) * 100));
  }

  async stop(): Promise<{ blob: Blob; url: string } | null> {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const fullBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(fullBlob);
        this.cleanup();
        resolve({ blob: fullBlob, url });
      };

      this.mediaRecorder.stop();
      this.isRecording = false;
    });
  }

  private cleanup() {
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.isRecording = false;
  }

  getIsRecording() {
    return this.isRecording;
  }
}
