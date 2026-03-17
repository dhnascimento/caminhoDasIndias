import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function Navigation({ onPrev, onNext, canGoPrev, canGoNext }: NavigationProps) {
  return (
    <>
      {/* Left navigation zone */}
      <button
        className="nav-zone left hidden md:flex"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="Previous slide"
      >
        <div className={`btn-control ${!canGoPrev ? 'opacity-30' : ''}`}>
          <ChevronLeftIcon className="w-6 h-6" />
        </div>
      </button>

      {/* Right navigation zone */}
      <button
        className="nav-zone right hidden md:flex"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next slide"
      >
        <div className={`btn-control ${!canGoNext ? 'opacity-30' : ''}`}>
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </button>
    </>
  );
}
