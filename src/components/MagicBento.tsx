import { useRef, useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import "./MagicBento.css";

const DEFAULT_PARTICLE_COUNT = 12;
const MOBILE_BREAKPOINT = 768;

type CardTheme =
  | "purple"
  | "orange"
  | "green"
  | "blue"
  | "pink"
  | "cyan"
  | "yellow"
  | "red";

interface CardData {
  title: string;
  description: string;
  label: string;
  theme?: CardTheme;
  fullWidth?: boolean;
}

interface ParticleCardProps {
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  theme?: CardTheme;
}

const getGlowColor = (theme: CardTheme): string => {
  const colors: Record<CardTheme, string> = {
    purple: "147, 51, 234",
    orange: "249, 115, 22",
    green: "34, 197, 94",
    blue: "59, 130, 246",
    pink: "236, 72, 153",
    cyan: "6, 182, 212",
    yellow: "234, 179, 8",
    red: "239, 68, 68",
  };
  return colors[theme] || colors.purple;
};

const createParticleElement = (
  x: number,
  y: number,
  color: string = "132, 0, 255"
) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard: React.FC<ParticleCardProps> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = "132, 0, 255",
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  theme,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);

  const effectiveGlowColor = theme ? getGlowColor(theme) : glowColor;

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        effectiveGlowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, effectiveGlowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      particle.style.opacity = "0";
      particle.style.transform = "scale(0)";
      setTimeout(() => {
        particle.parentNode?.removeChild(particle);
      }, 300);
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current!.appendChild(clone);
        particlesRef.current.push(clone);

        clone.style.transition = "all 0.3s ease";
        clone.style.transform = "scale(1)";
        clone.style.opacity = "1";

        // Animate particle floating
        let animationFrame: number;
        const startX = parseFloat(clone.style.left);
        const startY = parseFloat(clone.style.top);
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        let progress = 0;

        const animateFloat = () => {
          if (!isHoveredRef.current) return;
          progress += 0.01;
          const x = startX + Math.sin(progress * 2) * randomX;
          const y = startY + Math.cos(progress * 2) * randomY;
          clone.style.left = `${x}px`;
          clone.style.top = `${y}px`;
          clone.style.opacity = `${0.3 + Math.sin(progress * 3) * 0.4}`;
          animationFrame = requestAnimationFrame(animateFloat);
        };
        animateFloat();
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        element.style.transition = "transform 0.3s ease";
        element.style.transform =
          "perspective(1000px) rotateX(5deg) rotateY(5deg)";
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        element.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      }

      if (enableMagnetism) {
        element.style.transform = "translate(0, 0)";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Update glow position
      updateCardGlowProperties(element, e.clientX, e.clientY, 1, 300);

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        element.style.transition = "transform 0.1s ease";
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${effectiveGlowColor}, 0.4) 0%, rgba(${effectiveGlowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
        transition: transform 0.8s ease, opacity 0.8s ease;
      `;

      element.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = "scale(1)";
        ripple.style.opacity = "0";
      });

      setTimeout(() => ripple.remove(), 800);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    effectiveGlowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
      data-theme={theme}
    >
      {children}
    </div>
  );
};

interface MagicBentoProps {
  cards: CardData[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  particleCount?: number;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<MagicBentoProps> = ({
  cards,
  textAutoHide = true,
  enableStars = true,
  enableBorderGlow = true,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <div className="magic-bento-container">
      <div className="card-grid">
        {cards.map((card, index) => {
          const baseClassName = `magic-bento-card ${
            textAutoHide ? "magic-bento-card--text-autohide" : ""
          } ${enableBorderGlow ? "magic-bento-card--border-glow" : ""} ${
            card.fullWidth ? "full-width" : ""
          }`;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ParticleCard
                className={baseClassName}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
                theme={card.theme || "purple"}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <p className="magic-bento-card__description">
                    {card.description}
                  </p>
                </div>
              </ParticleCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;
export { ParticleCard, getGlowColor };
export type { CardData, CardTheme };
