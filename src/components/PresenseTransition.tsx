import {
  AnimatePresence,
  motion,
  MotionNodeAnimationOptions,
  Transition,
} from "framer-motion";
import React, { type PropsWithChildren } from "react";

const variantsMap = {
  subtleRise: {
    variants: {
      hidden: { opacity: 0.5, scale: 0.98 },
      visible: { opacity: 1, scale: 1 },
    },
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  fadeInOut: {
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    transition: { duration: 0.25, ease: "easeInOut" },
  },
} satisfies Record<string, MotionNodeAnimationOptions>;

type Props = {
  className?: string;
  transitionKey: React.Key;
  variant: keyof typeof variantsMap;
  transitionOptions?: Transition;
};

const PresenceTransition: React.FC<PropsWithChildren<Props>> = ({
  className,
  transitionKey,
  transitionOptions,
  variant,
  children,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        key={transitionKey}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variantsMap[variant].variants}
        transition={transitionOptions ?? variantsMap[variant].transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PresenceTransition;
