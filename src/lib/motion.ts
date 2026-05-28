export const fadeInUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -32 },
  visible: { opacity: 1, y: 0 },
};

export const blurIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const staggerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 },
  },
};

export const float = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const floatSlow = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 2, 0],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const pulseGlow = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const defaultTransition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 80,
  damping: 14,
};
