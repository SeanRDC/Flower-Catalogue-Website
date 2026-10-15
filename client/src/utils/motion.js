import { useReducedMotion } from 'framer-motion';

// Shared animation timing, mirrored by the --ease / --dur-* CSS variables in
// styles/global.css, so JavaScript (Framer Motion) and CSS animations move
// at the same speed with the same feel.
export const EASE = [0.2, 0.8, 0.2, 1];

export const DURATION = {
  fast: 0.2, // exits, small state changes
  base: 0.3, // overlays, panels, most transitions
  slow: 0.4, // page transitions, larger surfaces
  entrance: 0.6, // content arriving on the page
};

// Route-level page transition: fade in, quicker fade out. Opacity only, so
// it never creates a transform that would trap position: fixed children.
export const pageMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

// Dimmed backdrop behind dialogs and the full-size image viewer
export const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
};

// Dialog panel: drops in slightly, lifts out on close
export const panelMotion = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: DURATION.fast, ease: EASE } },
};

// Toast: rises in from the bottom, fades back down
export const toastMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: 8, transition: { duration: DURATION.fast, ease: EASE } },
};

// Returns the preset, or no animation at all when the visitor has asked their
// OS to reduce motion. (Framer's reducedMotion setting only removes movement;
// this also removes fades, so elements simply appear and disappear.)
export const useMotionPreset = (preset) => (useReducedMotion() ? {} : preset);
