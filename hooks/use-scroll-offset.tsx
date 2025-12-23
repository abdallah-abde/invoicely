"use client";

import { useScroll, useTransform } from "framer-motion";

export function useScrollOffset(multiplier = 40) {
  const { scrollYProgress } = useScroll();

  return useTransform(scrollYProgress, [0, 1], [0, multiplier]);
}
