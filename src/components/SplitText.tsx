import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  wordClassName = '',
  charClassName = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  threshold = 0.05,
  rootMargin = '0px',
  textAlign = 'left',
  tag = 'p',
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(true);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
        ScrollTrigger.refresh();
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      if (animationCompletedRef.current) return;

      const el = ref.current;
      const targets = el.querySelectorAll<HTMLElement>('.split-char, .split-word, .split-target');
      const animTargets = targets.length > 0 ? Array.from(targets) : [el];

      const tween = gsap.fromTo(
        animTargets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            once: true,
            fastScrollEnd: true
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        fontsLoaded
      ],
      scope: ref
    }
  );

  const renderContent = () => {
    if (splitType === 'words') {
      const words = text.split(' ');
      return words.map((word, wIdx) => (
        <span
          key={wIdx}
          className={`split-word split-target ${wordClassName}`}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {word}
          {wIdx < words.length - 1 ? '\u00A0' : ''}
        </span>
      ));
    }

    // Default 'chars' or 'words, chars'
    const words = text.split(' ');
    return words.map((word, wIdx) => (
      <span
        key={wIdx}
        className={`split-word ${wordClassName}`}
        style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {word.split('').map((char, cIdx) => (
          <span
            key={cIdx}
            className={`split-char split-target ${charClassName}`}
            style={{ display: 'inline-block', willChange: 'transform, opacity' }}
          >
            {char}
          </span>
        ))}
        {wIdx < words.length - 1 ? (
          <span className="split-space" style={{ display: 'inline-block' }}>
            &nbsp;
          </span>
        ) : null}
      </span>
    ));
  };

  const Tag = (tag || 'p') as React.ElementType;

  return (
    <Tag
      ref={ref}
      style={{
        textAlign,
        display: 'inline-block',
        willChange: 'transform, opacity'
      }}
      className={`split-parent ${className}`}
    >
      {renderContent()}
    </Tag>
  );
};

export default SplitText;
