"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type BlobProps = {
  size: number;
  color: string;
  blur?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

export function Blob({ size, color, blur = 80, ...position }: BlobProps) {
  const reduceMotion = useReducedMotion();

  // Random but stable movement per blob
  const movement = useMemo(() => {
    const range = 40;
    return {
      x: [0, Math.random() * range - range / 2],
      y: [0, Math.random() * range - range / 2],
    };
  }, []);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{
        opacity: 1,
        x: reduceMotion ? 0 : movement.x,
        y: reduceMotion ? 0 : movement.y,
      }}
      transition={{
        duration: reduceMotion ? 0 : 12 + Math.random() * 6,
        repeat: reduceMotion ? 0 : Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
      className={cn(`absolute rounded-full`, `${color}`)}
      style={{
        width: size,
        height: size,
        // background: color,
        filter: `blur(${blur}px)`,
        ...position,
      }}
    />
  );
}
