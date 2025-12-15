"use client"

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import React from 'react';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({ 
  children, 
  delay = 0, 
  distance = 30,
  duration = 0.72,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      y: distance 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // easeOutExpo
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 0,
  duration = 0.72,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1] // easeInOut
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  staggerDelay = 0.1,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Clone React elements and add variants prop
  const cloneWithVariants = (child: ReactNode, index: number): ReactNode => {
    if (!child || typeof child !== 'object' || !('type' in child)) {
      return <motion.div key={index} variants={itemVariants}>{child}</motion.div>;
    }

    // Check if it's a motion component by checking the component name or if it has motion props
    const childType = (child as React.ReactElement).type as any;
    const isMotionComponent = childType && (
      (typeof childType === 'function' && (
        childType.__framerMotionComponent ||
        childType.displayName?.includes('motion') ||
        childType.name?.includes('motion')
      )) ||
      (typeof childType === 'object' && childType.$$typeof)
    );

    if (isMotionComponent) {
      // Clone motion component and add variants
      return React.cloneElement(child as React.ReactElement<{ variants?: any }>, {
        key: (child as React.ReactElement).key || index,
        variants: itemVariants
      } as any);
    }

    // Regular element, wrap in motion.div
    return <motion.div key={index} variants={itemVariants}>{child}</motion.div>;
  };

  const childrenArray = Array.isArray(children) ? children : [children];
  const processedChildren = childrenArray.map((child, index) => cloneWithVariants(child, index));

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {processedChildren}
    </motion.div>
  );
};

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = 'left',
  delay = 0,
  distance = 50,
  duration = 0.84,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const xValue = direction === 'left' ? -distance : distance;

  const variants: Variants = {
    hidden: { 
      opacity: 0, 
      x: xValue 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

