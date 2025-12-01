import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealTextProps {
  children: string;
  containerClassName?: string;
  textClassName?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export function ScrollRevealText({
  children,
  containerClassName = "",
  textClassName = "",
  stagger = 0.03,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const text = typeof children === "string" ? children : "";
  const splitText = text.split("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <h2
        className={`inline-block text-center leading-relaxed font-black ${textClassName}`}
        style={{ fontSize: "clamp(1.6rem, 8vw, 10rem)" }}
      >
        {splitText.map((char, index) => {
          // Calculate individual character animation progress
          const start = (index / splitText.length) * 0.5;
          const end = start + 0.5;

          const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
          const yPercent = useTransform(
            scrollYProgress,
            [start, end],
            [120, 0]
          );
          const scaleY = useTransform(scrollYProgress, [start, end], [2.3, 1]);
          const scaleX = useTransform(scrollYProgress, [start, end], [0.7, 1]);

          return (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                opacity,
                y: yPercent,
                scaleY,
                scaleX,
                transformOrigin: "50% 0%",
                willChange: "opacity, transform",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </h2>
    </div>
  );
}
