import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import useEasyTracking from '../utils/trackingUtils';

interface AudioPlayerProps {
  src: string;
  /** Tailwind color suffix (e.g. 'amber-700') for accenting controls */
  accentColor?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, accentColor = 'amber-700' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  // Easy analytics tracking for media and downloads
  // Derive a simple media name from the src (e.g., filename)
  const mediaName = src.split('/').pop() || src;
  const { trackMedia, trackDownload } = useEasyTracking();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(0.85);

  const speedOptions = [0.25, 0.5, 0.75, 0.85, 1, 1.25, 1.5, 2];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // apply playback rate
    audio.playbackRate = playbackRate;

    const handleTimeUpdate = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src, playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    // Track play/pause actions
    const action = isPlaying ? 'pause' : 'play';
    trackMedia(mediaName, action);
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio || audio.duration === 0) return;
    // Seek to new time and update progress
    audio.currentTime = (value / 100) * audio.duration;
    const pct = value / 100;
    setProgress(pct);
    // Track seek interaction
    trackMedia(mediaName, 'seeked');
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-4 border border-white/30 rounded-full">
      <button
        onClick={togglePlay}
        className="p-4 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md focus:outline-none shadow-lg"
      >
        {isPlaying ? (
          <Pause className={`h-6 w-6 text-${accentColor}`} />
        ) : (
          <Play className={`h-6 w-6 text-${accentColor}`} />
        )}
      </button>
      <div className="flex items-center gap-4 flex-grow bg-white/30 border border-white/80 bg-white/10 backdrop-blur-md shadow-lg rounded-full px-4 py-4">
      <input
        type="range"
        min="0"
        max="100"
        value={progress * 100}
        onChange={handleSeek}
        className={`w-full accent-${accentColor} bg-transparent`}
      />

        <select
          value={playbackRate}
          onChange={handleRateChange}
          className={`bg-transparent border-none focus:ring-0`}
        >
          {speedOptions.map((speed) => (
            <option key={speed} value={speed}>
              {speed}x
            </option>
          ))}
        </select>
      </div>
      <a
        href={`${src}?download=`}
        // Track file download event
        onClick={() => trackDownload(mediaName)}
        className="p-4 flex items-center justify-center rounded-full bg-white/30 border border-white/30 backdrop-blur-md hover:bg-white/40 shadow-lg"
      >
        <Download className={`h-6 w-6 text-${accentColor}`} />
      </a>
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

export default AudioPlayer;