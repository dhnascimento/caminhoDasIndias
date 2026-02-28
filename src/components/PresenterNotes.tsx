import type { Slide } from '../types/slides';

interface PresenterNotesProps {
  slide: Slide;
  isVisible: boolean;
}

export function PresenterNotes({ slide, isVisible }: PresenterNotesProps) {
  // Access notes from the slide (all slide types can have notes via SlideEnrichments)
  const notes = (slide as { notes?: string }).notes;

  if (!isVisible || !notes) return null;

  return (
    <div className="fixed bottom-20 left-6 right-6 max-w-2xl mx-auto z-40 animate-fade-in">
      <div className="glass rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wider">
            Presenter Notes
          </span>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          {notes}
        </p>
      </div>
    </div>
  );
}
