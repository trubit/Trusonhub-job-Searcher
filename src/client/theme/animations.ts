import type { Variants, Transition } from 'framer-motion';

/** Shared smooth easing */
export const ease = [0.4, 0, 0.2, 1] as const;
export const easeOut = [0, 0, 0.2, 1] as const;

export const defaultTransition: Transition = {
  duration: 0.35,
  ease,
};

/** Fade up — primary entrance animation */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/** Fade in — simple opacity reveal */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease } },
};

/** Slide in from right */
export const slideRight: Variants = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

/** Slide in from left */
export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
};

/** Scale entrance */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

/** Stagger container — wraps lists of animated children */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Stagger item — child of staggerContainer */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

/** Modal / drawer entrance */
export const modalEnter: Variants = {
  hidden:  { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: { duration: 0.25, ease } },
  exit:    { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.2, ease } },
};

/** Page transition */
export const pageTransition: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.4, ease } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.25, ease } },
};

/** Hover lift — for cards */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease } },
  whileTap:   { y: 0,  transition: { duration: 0.1 } },
};
