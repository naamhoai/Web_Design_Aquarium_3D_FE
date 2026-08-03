import React, { useEffect, useRef } from 'react';

interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  secondaryColor?: string;
  stripeColor?: string;
  type: 'goldfish' | 'tetra' | 'clown' | 'angelfish' | 'arowana' | 'discus';
  wiggleSpeed: number;
  wiggleAngle: number;
  targetX: number;
  targetY: number;
  maxSpeed: number;
  scared: boolean;
}

interface AmbientBubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface PlantStem {
  x: number;
  height: number;
  segments: number;
  baseWidth: number;
  color: string;
  swayOffset: number;
  swaySpeed: number;
}

export const SplashCanvas: React.FC<{ interactive?: boolean }> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize Swaying Plants
    const plantStems: PlantStem[] = [];
    const numPlants = Math.floor(width / 30);
    for (let i = 0; i < numPlants; i++) {
      plantStems.push({
        x: i * 30 + (Math.random() * 20 - 10),
        height: Math.random() * 160 + 120,
        segments: 9,
        baseWidth: Math.random() * 7 + 6,
        color: i % 2 === 0 ? '#059669' : i % 3 === 0 ? '#10b981' : '#047857',
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.022 + 0.015,
      });
    }

    // Initialize Rich Ambient Floating Bubbles across the screen
    const bubbles: AmbientBubble[] = [];
    const createBubble = (yPos = height + 20) => {
      bubbles.push({
        x: Math.random() * width,
        y: yPos,
        size: Math.random() * 10 + 3,
        speed: Math.random() * 1.6 + 0.7,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
        opacity: Math.random() * 0.55 + 0.35,
      });
    };

    for (let i = 0; i < 75; i++) {
      createBubble(Math.random() * height);
    }

    // Realistic Fish Definitions
    const fishTypes: Array<{
      type: Fish['type'];
      color: string;
      secondary?: string;
      stripe?: string;
    }> = [
      { type: 'discus', color: '#ec4899', secondary: '#0284c7', stripe: '#38bdf8' },
      { type: 'arowana', color: '#d97706', secondary: '#fbbf24', stripe: '#f59e0b' },
      { type: 'tetra', color: '#ef4444', secondary: '#00f2fe', stripe: '#38bdf8' },
      { type: 'goldfish', color: '#f97316', secondary: '#fbbf24' },
      { type: 'clown', color: '#ff6b00', secondary: '#ffffff', stripe: '#0f172a' },
      { type: 'angelfish', color: '#ffffff', secondary: '#94a3b8', stripe: '#0f172a' },
    ];

    const fishList: Fish[] = [];
    const createFish = (): Fish => {
      const spec = fishTypes[Math.floor(Math.random() * fishTypes.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * (height * 0.75) + 50,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: spec.type === 'arowana' ? 42 : spec.type === 'discus' ? 34 : Math.random() * 14 + 22,
        color: spec.color,
        secondaryColor: spec.secondary,
        stripeColor: spec.stripe,
        type: spec.type,
        wiggleSpeed: Math.random() * 0.12 + 0.08,
        wiggleAngle: Math.random() * Math.PI * 2,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        maxSpeed: spec.type === 'arowana' ? 2.4 : Math.random() * 1.5 + 1.2,
        scared: false,
      };
    };

    for (let i = 0; i < 16; i++) {
      fishList.push(createFish());
    }

    const ripples: Ripple[] = [];
    let raysTime = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.random() * 90 + 75,
        opacity: 0.9,
      });

      fishList.forEach((fish) => {
        const dx = fish.x - e.clientX;
        const dy = fish.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 280) {
          fish.scared = true;
          const angle = Math.atan2(dy, dx);
          fish.vx = Math.cos(angle) * 6.5;
          fish.vy = Math.sin(angle) * 6.5;
          fish.targetX = fish.x + Math.cos(angle) * 450;
          fish.targetY = fish.y + Math.sin(angle) * 450;
          setTimeout(() => {
            fish.scared = false;
          }, 2200);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Main Animation Loop
    const render = () => {
      // 1. Crystal Water Ambient Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#e0f2fe');
      bgGrad.addColorStop(0.45, '#bae6fd');
      bgGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Volumetric Sunbeams & Surface Lighting Caustics
      raysTime += 0.008;
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const numRays = 8;
      for (let i = 0; i < numRays; i++) {
        const xOffset = Math.sin(raysTime + i * 1.8) * 100;
        const rayWidth = 140 + Math.sin(raysTime * 1.4 + i) * 60;
        const rayStart = (width / numRays) * i + (width / numRays) / 2 + xOffset;

        const grad = ctx.createLinearGradient(rayStart, 0, rayStart + xOffset * 0.6, height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(rayStart - rayWidth / 2, 0);
        ctx.lineTo(rayStart + rayWidth / 2, 0);
        ctx.lineTo(rayStart + rayWidth / 2 + xOffset, height);
        ctx.lineTo(rayStart - rayWidth / 2 + xOffset, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Swaying Aquatic Seaweeds & Plants at Bottom
      plantStems.forEach((p) => {
        p.swayOffset += p.swaySpeed;
        const sway = Math.sin(p.swayOffset) * 25;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.baseWidth;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(p.x, height);

        let currX = p.x;
        let currY = height;
        const segHeight = p.height / p.segments;

        for (let s = 1; s <= p.segments; s++) {
          const progress = s / p.segments;
          const targetX = p.x + sway * Math.pow(progress, 1.5);
          const targetY = height - segHeight * s;

          ctx.quadraticCurveTo(currX, currY - segHeight / 2, targetX, targetY);
          currX = targetX;
          currY = targetY;
        }
        ctx.stroke();

        // Foliage Top Leaf
        ctx.beginPath();
        ctx.ellipse(currX, currY - 10, 6, 14, (sway * 0.02), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 4. Ambient Floating Bubbles Rising Across the Screen
      if (Math.random() < 0.12 && bubbles.length < 110) {
        createBubble();
      }

      bubbles.forEach((b, idx) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const xWobble = Math.sin(b.wobble) * 4;

        ctx.beginPath();
        ctx.arc(b.x + xWobble, b.y, b.size, 0, Math.PI * 2);

        // 3D Glass Bubble Reflection Gradient
        const grad = ctx.createRadialGradient(
          b.x + xWobble - b.size / 3,
          b.y - b.size / 3,
          b.size / 10,
          b.x + xWobble,
          b.y,
          b.size
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0.1)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        // Highlight sheen spot inside bubble
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x + xWobble - b.size * 0.35, b.y - b.size * 0.35, b.size * 0.22, 0, Math.PI * 2);
        ctx.fill();

        if (b.y < -20) {
          bubbles[idx] = {
            x: Math.random() * width,
            y: height + 20,
            size: Math.random() * 10 + 3,
            speed: Math.random() * 1.6 + 0.7,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.04 + 0.02,
            opacity: Math.random() * 0.55 + 0.35,
          };
        }
      });

      // 5. Update & Render Realistic 3D Fish
      fishList.forEach((fish) => {
        if (!fish.scared) {
          const dx = fish.targetX - fish.x;
          const dy = fish.targetY - fish.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            fish.targetX = Math.random() * width;
            fish.targetY = Math.random() * (height * 0.8) + 40;
          }

          const targetAngle = Math.atan2(dy, dx);
          const targetVx = Math.cos(targetAngle) * fish.maxSpeed;
          const targetVy = Math.sin(targetAngle) * fish.maxSpeed;

          fish.vx += (targetVx - fish.vx) * 0.02;
          fish.vy += (targetVy - fish.vy) * 0.02;
        }

        if (interactive && mouseRef.current.active && !fish.scared) {
          const mdx = fish.x - mouseRef.current.x;
          const mdy = fish.y - mouseRef.current.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            const force = (180 - mdist) / 180;
            const pushAngle = Math.atan2(mdy, mdx);
            fish.vx += Math.cos(pushAngle) * force * 2.0;
            fish.vy += Math.sin(pushAngle) * force * 2.0;
          }
        }

        const currSpeed = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy);
        const maxLimit = fish.scared ? fish.maxSpeed * 3 : fish.maxSpeed;
        if (currSpeed > maxLimit) {
          fish.vx = (fish.vx / currSpeed) * maxLimit;
          fish.vy = (fish.vy / currSpeed) * maxLimit;
        }

        fish.x += fish.vx;
        fish.y += fish.vy;

        const padding = 70;
        if (fish.x < -padding) fish.x = width + padding;
        if (fish.x > width + padding) fish.x = -padding;
        if (fish.y < -padding) fish.y = height + padding;
        if (fish.y > height + padding) fish.y = -padding;

        // Render Fish
        ctx.save();
        ctx.translate(fish.x, fish.y);
        const angle = Math.atan2(fish.vy, fish.vx);
        ctx.rotate(angle);

        fish.wiggleAngle += fish.wiggleSpeed * (currSpeed / fish.maxSpeed + 0.5);
        const wiggleVal = Math.sin(fish.wiggleAngle) * 7;

        // Radial 3D Shading
        const bodyGrad = ctx.createRadialGradient(0, -fish.size * 0.2, fish.size * 0.1, 0, 0, fish.size);
        bodyGrad.addColorStop(0, '#ffffff');
        bodyGrad.addColorStop(0.3, fish.color);
        bodyGrad.addColorStop(1, fish.secondaryColor || '#0284c7');

        if (fish.type === 'discus') {
          // Circular Discus Fish
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.78, fish.size * 0.68, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pattern Stripes
          ctx.strokeStyle = fish.stripeColor || '#38bdf8';
          ctx.lineWidth = 2.8;
          for (let s = -2; s <= 2; s++) {
            ctx.beginPath();
            ctx.arc(s * 8, 0, fish.size * 0.62, -Math.PI / 3, Math.PI / 3);
            ctx.stroke();
          }

          // Flowing Translucent Tail Fin
          ctx.fillStyle = fish.color;
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.7, 0);
          ctx.quadraticCurveTo(-fish.size * 1.15, -fish.size * 0.55 + wiggleVal, -fish.size * 1.4, wiggleVal);
          ctx.quadraticCurveTo(-fish.size * 1.15, fish.size * 0.55 + wiggleVal, -fish.size * 0.7, 0);
          ctx.fill();

          // Eye Detail
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fish.size * 0.45, -fish.size * 0.16, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(fish.size * 0.46, -fish.size * 0.16, 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(fish.size * 0.47, -fish.size * 0.16, 1.4, 0, Math.PI * 2);
          ctx.fill();

        } else if (fish.type === 'arowana') {
          // Golden Arowana
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.moveTo(fish.size * 1.15, 0);
          ctx.quadraticCurveTo(fish.size * 0.5, -fish.size * 0.3, -fish.size * 0.85, -fish.size * 0.16);
          ctx.lineTo(-fish.size * 0.85, fish.size * 0.16);
          ctx.quadraticCurveTo(fish.size * 0.5, fish.size * 0.3, fish.size * 1.15, 0);
          ctx.fill();

          // Golden Scale Overlay
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.3;
          for (let sc = -0.5; sc <= 0.6; sc += 0.22) {
            ctx.beginPath();
            ctx.ellipse(sc * fish.size, 0, 4.5, 9, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Tail
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.85, 0);
          ctx.quadraticCurveTo(-fish.size * 1.25, -fish.size * 0.38 + wiggleVal, -fish.size * 1.5, wiggleVal);
          ctx.quadraticCurveTo(-fish.size * 1.25, fish.size * 0.38 + wiggleVal, -fish.size * 0.85, 0);
          ctx.fill();

          // Eye
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(fish.size * 0.82, -fish.size * 0.05, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(fish.size * 0.84, -fish.size * 0.05, 2.2, 0, Math.PI * 2);
          ctx.fill();

        } else if (fish.type === 'tetra') {
          // Neon Tetra
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.72, fish.size * 0.26, 0, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Neon Stripe
          ctx.fillStyle = fish.secondaryColor || '#00f2fe';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.ellipse(0, -fish.size * 0.05, fish.size * 0.52, fish.size * 0.08, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Tail
          ctx.fillStyle = fish.color;
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.62, 0);
          ctx.lineTo(-fish.size * 1.2, -fish.size * 0.38 + wiggleVal);
          ctx.lineTo(-fish.size * 1.2, fish.size * 0.38 + wiggleVal);
          ctx.closePath();
          ctx.fill();

        } else {
          // Standard Fish
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.68, fish.size * 0.44, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.58, 0);
          ctx.lineTo(-fish.size * 1.15, -fish.size * 0.42 + wiggleVal);
          ctx.lineTo(-fish.size * 1.15, fish.size * 0.42 + wiggleVal);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fish.size * 0.32, -fish.size * 0.06, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(fish.size * 0.34, -fish.size * 0.06, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 6. Water Ripples
      ripples.forEach((rp, idx) => {
        rp.radius += 3.0;
        rp.opacity -= 0.016;

        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.opacity})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (rp.opacity <= 0) {
          ripples.splice(idx, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 1,
      }}
    />
  );
};
