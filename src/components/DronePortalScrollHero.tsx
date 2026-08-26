import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { 
  Sparkles, 
  ChevronDown, 
  ArrowDown, 
  Radio
} from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import SplitText from './SplitText';

import frame1Src from '../assets/images/drone_portal_frame1_1787579775508.jpg';
import frame2Src from '../assets/images/drone_portal_frame2_1787579795187.jpg';
import frame3Src from '../assets/images/drone_portal_frame3_1787579819000.jpg';
import frame4Src from '../assets/images/drone_portal_frame4_1787579843287.jpg';

interface DronePortalScrollHeroProps {
  onExploreApps: () => void;
  onLearnMore: () => void;
  onWarpComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  pz: number;
  speed: number;
  color: string;
  size: number;
}

interface Streak {
  angle: number;
  length: number;
  speed: number;
  radius: number;
  opacity: number;
  color: string;
}

export const DronePortalScrollHero: React.FC<DronePortalScrollHeroProps> = ({
  onExploreApps,
  onLearnMore,
  onWarpComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation state & interpolation targets
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Smooth inertial interpolation values
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const velocityRef = useRef(0);

  // Image cache refs (4 keyframes matching reference video progression)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Simulation buffers
  const particlesRef = useRef<Particle[]>([]);
  const streaksRef = useRef<Streak[]>([]);

  // Hook into viewport scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Load and cache all 4 reference keyframe video textures
  useEffect(() => {
    const sources = [frame1Src, frame2Src, frame3Src, frame4Src];
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    sources.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        loadedCount++;
        loadedImages[idx] = img;
        if (loadedCount === sources.length) {
          imagesRef.current = loadedImages;
          setImagesLoaded(true);
        }
      };
    });

    // 3D relativistic particles
    const particles: Particle[] = [];
    for (let i = 0; i < 220; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2400,
        y: (Math.random() - 0.5) * 2400,
        z: Math.random() * 1000 + 1,
        pz: Math.random() * 1000 + 1,
        speed: Math.random() * 9 + 4,
        color: Math.random() > 0.35 ? '#c084fc' : '#e879f9',
        size: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;

    // Radial hyperspace tunnel streaks
    const streaks: Streak[] = [];
    for (let i = 0; i < 60; i++) {
      streaks.push({
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 200 + 80,
        speed: Math.random() * 0.06 + 0.02,
        radius: Math.random() * 480 + 40,
        opacity: Math.random() * 0.7 + 0.3,
        color: i % 2 === 0 ? 'rgba(216, 180, 254, 0.9)' : 'rgba(168, 85, 247, 0.95)',
      });
    }
    streaksRef.current = streaks;
  }, []);

  // Update target progress from scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      targetProgressRef.current = latest;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Main 60FPS Video Canvas Engine & Compositor Loop
  useEffect(() => {
    let animId: number;

    const renderLoop = (time: number) => {
      animId = requestAnimationFrame(renderLoop);

      // Inertial LERP smoothing
      const prevProgress = currentProgressRef.current;
      const lerpFactor = 0.095;
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * lerpFactor;
      
      const p = Math.max(0, Math.min(1, currentProgressRef.current));
      velocityRef.current = Math.abs(p - prevProgress);
      setScrollProgress(p);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear dark cosmic background
      ctx.fillStyle = '#08090e';
      ctx.fillRect(0, 0, width, height);

      // Draw Keyframe Blend across 3 intervals (4 frames)
      const images = imagesRef.current;
      if (images.length === 4) {
        const totalSegments = 3;
        const segmentProgress = p * totalSegments;
        const currentSegment = Math.min(Math.floor(segmentProgress), totalSegments - 1);
        const segmentFrac = segmentProgress - currentSegment; // 0..1 blend weight

        const imgA = images[currentSegment];
        const imgB = images[Math.min(currentSegment + 1, 3)];

        // Dynamic Camera Zoom & Optical Flow
        const globalZoom = 1.0 + p * 0.35;
        const localZoomA = 1.0 + segmentFrac * 0.12;
        const localZoomB = 1.0 - (1 - segmentFrac) * 0.10;

        // Camera POV Shake/Wobble based on scroll velocity
        const shake = (velocityRef.current * 20 + (p > 0.4 ? 1.4 : 0.4)) * 0.9;
        const shakeX = (Math.sin(time * 0.02) * shake);
        const shakeY = (Math.cos(time * 0.025) * shake);

        const drawCenteredImage = (img: HTMLImageElement, alpha: number, scaleFactor: number) => {
          if (!img || !img.complete || img.naturalWidth === 0) return;
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          
          const cx = width / 2 + shakeX;
          const cy = height / 2 + shakeY;

          // Object-cover aspect ratio fitting
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = width / height;
          let drawW = width;
          let drawH = height;

          if (canvasAspect > imgAspect) {
            drawW = width;
            drawH = width / imgAspect;
          } else {
            drawH = height;
            drawW = height * imgAspect;
          }

          drawW *= globalZoom * scaleFactor;
          drawH *= globalZoom * scaleFactor;

          ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          ctx.restore();
        };

        // Draw Base Frame
        drawCenteredImage(imgA, 1, localZoomA);

        // Crossfade Blend with Next Frame using smooth cubic ease
        const blendEase = segmentFrac < 0.5
          ? 2 * segmentFrac * segmentFrac
          : -1 + (4 - 2 * segmentFrac) * segmentFrac;
        
        if (segmentFrac > 0) {
          drawCenteredImage(imgB, blendEase, localZoomB);
        }

        // Relativistic 3D Warp Particles & Radial Tunnel Streaks during high acceleration
        if (p > 0.30 || velocityRef.current > 0.003) {
          const warpIntensity = Math.max(0, (p - 0.30) / 0.70) + velocityRef.current * 8;
          
          // Draw relativistic 3D purple warp particles
          const particles = particlesRef.current;
          const halfW = width / 2;
          const halfH = height / 2;
          const speedMultiplier = (1 + warpIntensity * 14);

          ctx.save();
          ctx.fillStyle = '#c084fc';
          for (let i = 0; i < particles.length; i++) {
            const pt = particles[i];
            pt.pz = pt.z;
            pt.z -= pt.speed * speedMultiplier;

            if (pt.z <= 0) {
              pt.z = 1000;
              pt.pz = 1000;
              pt.x = (Math.random() - 0.5) * width * 1.5;
              pt.y = (Math.random() - 0.5) * height * 1.5;
            }

            const k = 280 / pt.z;
            const px = pt.x * k + halfW;
            const py = pt.y * k + halfH;

            const pk = 280 / pt.pz;
            const ppx = pt.x * pk + halfW;
            const ppy = pt.y * pk + halfH;

            if (px >= 0 && px <= width && py >= 0 && py <= height) {
              const alpha = Math.min(1, (1000 - pt.z) / 400) * (0.3 + warpIntensity * 0.7);
              ctx.strokeStyle = pt.color;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = pt.size * (1 + warpIntensity);
              ctx.beginPath();
              ctx.moveTo(ppx, ppy);
              ctx.lineTo(px, py);
              ctx.stroke();
            }
          }
          ctx.restore();

          // Radial Speed Rings inside deep vortex tunnel (p: 0.55 -> 1.0)
          if (p > 0.55) {
            const streaks = streaksRef.current;
            const tunnelProgress = (p - 0.55) / 0.45;
            ctx.save();
            ctx.translate(halfW, halfH);

            for (let i = 0; i < streaks.length; i++) {
              const s = streaks[i];
              s.angle += s.speed * (1 + tunnelProgress * 2.2);
              const r = s.radius * (1 + tunnelProgress * 0.6);
              const sx = Math.cos(s.angle) * r;
              const sy = Math.sin(s.angle) * r;
              const ex = Math.cos(s.angle) * (r + s.length * (1 + tunnelProgress * 2.8));
              const ey = Math.sin(s.angle) * (r + s.length * (1 + tunnelProgress * 2.8));

              ctx.strokeStyle = s.color;
              ctx.globalAlpha = s.opacity * tunnelProgress * 0.95;
              ctx.lineWidth = 2 + tunnelProgress * 3.5;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(ex, ey);
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }

      // Vignette & Cinematic Letterbox overlay
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, height * 0.25,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(8, 9, 14, 0)');
      grad.addColorStop(0.7, 'rgba(8, 9, 14, 0.4)');
      grad.addColorStop(1, 'rgba(8, 9, 14, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Blinding Purple & White Singularity Flash Explosion at peak singularity crossing (p: 0.82 -> 1.0)
      if (p >= 0.80) {
        const flashFrac = (p - 0.80) / 0.20; // 0..1
        const flashIntensity = flashFrac;
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Expanding Core Flare
        const coreFlareRadius = Math.max(width, height) * (0.6 + flashIntensity * 1.5);
        const flareGrad = ctx.createRadialGradient(
          width / 2, height / 2, 0,
          width / 2, height / 2, coreFlareRadius
        );
        flareGrad.addColorStop(0, `rgba(255, 255, 255, ${flashIntensity * 0.95})`);
        flareGrad.addColorStop(0.3, `rgba(232, 121, 249, ${flashIntensity * 0.85})`);
        flareGrad.addColorStop(0.7, `rgba(168, 85, 247, ${flashIntensity * 0.65})`);
        flareGrad.addColorStop(1, 'rgba(107, 33, 168, 0)');

        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, 0, width, height);

        // Blinding whiteout spike at final crossing peak
        if (flashIntensity > 0.7) {
          const whiteout = (flashIntensity - 0.7) * 3.33;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.85, whiteout * 0.85)})`;
          ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [onWarpComplete]);

  const scrollToApps = () => {
    if (containerRef.current) {
      const bottom = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({
        top: bottom - 20,
        behavior: 'smooth',
      });
    } else {
      onExploreApps();
    }
  };

  return (
    <div
      ref={containerRef}
      id="drone-portal-scroll-container"
      className="relative w-full h-[300vh] bg-[#08090E]"
    >
      {/* Sticky Fullscreen 60FPS Video Canvas Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#08090E]">
        
        {/* Hardware-Accelerated 60FPS Render Canvas */}
        <canvas
          ref={canvasRef}
          id="drone-video-canvas"
          className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
        />

        {/* Initial Hero Typography & CTAs (Fades seamlessly as scroll starts) */}
        <div
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-auto transition-all duration-300"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 3.5),
            transform: `translateY(${-scrollProgress * 90}px) scale(${1 - scrollProgress * 0.1})`,
            pointerEvents: scrollProgress > 0.2 ? 'none' : 'auto',
          }}
        >
          <div className="max-w-2xl space-y-6 pt-12">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                <SplitText
                  text="Powering Performance."
                  tag="div"
                  splitType="chars"
                  delay={100}
                  duration={2.2}
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  textAlign="left"
                  className="text-white block drop-shadow-md"
                />
                <div className="block mt-1">
                  <SplitText
                    text="Securing Innovation."
                    tag="div"
                    splitType="chars"
                    delay={130}
                    duration={2.2}
                    from={{ opacity: 0, y: 30 }}
                    to={{ opacity: 1, y: 0 }}
                    textAlign="left"
                    className="block"
                    charClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 inline-block font-extrabold drop-shadow-lg"
                  />
                </div>
              </h1>
            </div>

            <div className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow">
              <SplitText
                text="Discover powerful software built by FORBIDEN. Engineered for performance. Designed for the future."
                tag="p"
                splitType="words"
                delay={80}
                duration={2.0}
                from={{ opacity: 0, y: 20 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
                className="text-slate-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <AnimatedButton
                id="portal-hero-explore-btn"
                onClick={scrollToApps}
                className="px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-xl shadow-purple-900/50 hover:shadow-purple-600/60 cursor-pointer [--shine:rgba(255,255,255,0.85)]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>Enter Portal • Explore</span>
                </span>
              </AnimatedButton>

              <AnimatedButton
                id="portal-hero-learn-more-btn"
                onClick={onLearnMore}
                className="px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-[#121424]/90 hover:bg-[#1a1d33] border border-purple-900/50 hover:border-purple-500/40 backdrop-blur-md cursor-pointer [--shine:rgba(192,132,252,0.7)] shadow-lg shadow-purple-950/40"
              >
                <span>Learn More</span>
              </AnimatedButton>
            </div>

            {/* Clean Scroll Indicator Prompt */}
            <div className="pt-6 flex items-center gap-3 text-xs text-purple-300/80 animate-pulse">
              <ArrowDown size={14} className="animate-bounce text-purple-400" />
              <span>Scroll down to enter the portal</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DronePortalScrollHero;
