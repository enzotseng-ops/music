interface PlayButtonProps {
  readonly isPlaying: boolean;
  readonly onToggle: () => void;
  readonly disabled?: boolean;
}

export function PlayButton({ isPlaying, onToggle, disabled }: PlayButtonProps) {
  return (
    <button
      type="button"
      className="play-button"
      aria-label={isPlaying ? 'Stop' : 'Start'}
      aria-pressed={isPlaying}
      onClick={onToggle}
      disabled={disabled}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
          <polygon points="7,4 21,12 7,20" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
