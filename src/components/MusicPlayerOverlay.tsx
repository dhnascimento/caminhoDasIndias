import type { MusicTrack } from '../types/slides';

function getEmbedUrl(provider: 'tidal' | 'spotify', url: string): string {
  const id = url.split('/').pop()?.split('?')[0] ?? '';
  if (provider === 'tidal') {
    return `https://embed.tidal.com/tracks/${id}`;
  }
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator&autoplay=1`;
}

interface MusicPlayerOverlayProps {
  music: MusicTrack | undefined;
  isOpen: boolean;
}

export function MusicPlayerOverlay({ music, isOpen }: MusicPlayerOverlayProps) {
  if (!music) return null;
  return (
    <div className={`absolute bottom-6 right-6 z-20 rounded-xl overflow-hidden shadow-lg ${isOpen ? 'hidden sm:block' : 'hidden'}`}>
      <iframe
        key={music.url}
        src={getEmbedUrl(music.provider, music.url)}
        width={320}
        height={music.provider === 'tidal' ? 128 : 152}
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        title="Music player"
      />
    </div>
  );
}
