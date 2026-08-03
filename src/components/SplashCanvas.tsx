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

interface Bubble {
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
    const numPlants = Math.floor(width / 35);
    for (let i = 0; i < numPlants; i++) {
      plantStems.push({
        x: i * 35 + (Math.random() * 20 - 10),
        height: Math.random() * 140 + 110,
        segments: 8,
        baseWidth: Math.random() * 6 + 6,
        color: i % 2 === 0 ? '#059669' : i % 3 === 0 ? '#10b981' : '#047857',
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.015,
      });
    }

    // Initialize Bubbles
    const bubbles: Bubble[] = [];
    const createBubble = (yPos = height + 10) => {
      bubbles.push({
        x: Math.random() * width,
        y: yPos,
        size: Math.random() * 7 + 2.5,
        speed: Math.random() * 1.8 + 0.6,
        wobble: 0,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        opacity: Math.random() * 0.5 + 0.25,
      });
    };

    for (let i = 0; i < 50; i++) {
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
      { type: 'arowana', color: '#d97706', secondary: '#ef4444', stripe: '#fbbf24' },
      { type: 'tetra', color: '#ef4444', secondary: '#0284c7', stripe: '#38bdf8' },
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
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1.2,
        size: spec.type === 'arowana' ? 38 : spec.type === 'discus' ? 30 : Math.random() * 12 + 18,
        color: spec.color,
        secondaryColor: spec.secondary,
        stripeColor: spec.stripe,
        type: spec.type,
        wiggleSpeed: Math.random() * 0.12 + 0.08,
        wiggleAngle: Math.random() * Math.PI * 2,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        maxSpeed: spec.type === 'arowana' ? 2.2 : Math.random() * 1.4 + 1.1,
        scared: false,
      };
    };

    for (let i = 0; i < 14; i++) {
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
        maxRadius: Math.random() * 90 + 70,
        opacity: 0.85,
      });

      fishList.forEach((fish) => {
        const dx = fish.x - e.clientX;
        const dy = fish.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 260) {
          fish.scared = true;
          const angle = Math.atan2(dy, dx);
          fish.vx = Math.cos(angle) * 6;
          fish.vy = Math.sin(angle) * 6;
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

    // Animation Loop (Bright Luxury Crystal Water)
    const render = () => {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#e0f2fe');
      bgGrad.addColorStop(0.5, '#bae6fd');
      bgGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Volumetric Sunbeams & Light Rays
      raysTime += 0.008;
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const numRays = 7;
      for (let i = 0; i < numRays; i++) {
        const xOffset = Math.sin(raysTime + i * 1.8) * 90;
        const rayWidth = 130 + Math.sin(raysTime * 1.4 + i) * 50;
        const rayStart = (width / numRays) * i + (width / numRays) / 2 + xOffset;

        const grad = ctx.createLinearGradient(rayStart, 0, rayStart + xOffset * 0.6, height);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
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

      // 2. Swaying Aquatic Plants
      plantStems.forEach((p) => {
        p.swayOffset += p.swaySpeed;
        const sway = Math.sin(p.swayOffset) * 22;

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

        ctx.beginPath();
        ctx.ellipse(currX, currY - 8, 5, 12, (sway * 0.02), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 3. Floating Bubbles
      if (Math.random() < 0.1 && bubbles.length < 90) {
        createBubble();
      }

      bubbles.forEach((b, idx) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const xWobble = Math.sin(b.wobble) * 3;

        ctx.beginPath();
        ctx.arc(b.x + xWobble, b.y, b.size, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          b.x + xWobble - b.size / 3,
          b.y - b.size / 3,
          b.size / 10,
          b.x + xWobble,
          b.y,
          b.size
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.4, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, 'rgba(2, 132, 199, 0.1)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.fill();
        ctx.stroke();

        if (b.y < -15) {
          bubbles[idx] = {
            x: Math.random() * width,
            y: height + 15,
            size: Math.random() * 7 + 2.5,
            speed: Math.random() * 1.8 + 0.6,
            wobble: 0,
            wobbleSpeed: Math.random() * 0.05 + 0.02,
            opacity: Math.random() * 0.5 + 0.25,
          };
        }
      });

      // 4. Update & Render Realistic Fish
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
          if (mdist < 160) {
            const force = (160 - mdist) / 160;
            const pushAngle = Math.atan2(mdy, mdx);
            fish.vx += Math.cos(pushAngle) * force * 1.8;
            fish.vy += Math.sin(pushAngle) * force * 1.8;
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

        const padding = 60;
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
        const wiggleVal = Math.sin(fish.wiggleAngle) * 6;

        const bodyGrad = ctx.createLinearGradient(0, -fish.size * 0.3, 0, fish.size * 0.3);
        bodyGrad.addColorStop(0, fish.color);
        bodyGrad.addColorStop(1, fish.secondaryColor || '#0284c7');

        if (fish.type === 'discus') {
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.75, fish.size * 0.65, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = fish.stripeColor || '#38bdf8';
          ctx.lineWidth = 2.5;
          for (let s = -2; s <= 2; s++) {
            ctx.beginPath();
            ctx.arc(s * 7, 0, fish.size * 0.6, -Math.PI / 3, Math.PI / 3);
            ctx.stroke();
          }

          ctx.fillStyle = fish.color;
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.7, 0);
          ctx.quadraticCurveTo(-fish.size * 1.1, -fish.size * 0.5 + wiggleVal, -fish.size * 1.3, wiggleVal);
          ctx.quadraticCurveTo(-fish.size * 1.1, fish.size * 0.5 + wiggleVal, -fish.size * 0.7, 0);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(fish.size * 0.45, -fish.size * 0.15, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(fish.size * 0.46, -fish.size * 0.15, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (fish.type === 'arowana') {
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.moveTo(fish.size * 1.1, 0);
          ctx.quadraticCurveTo(fish.size * 0.5, -fish.size * 0.28, -fish.size * 0.8, -fish.size * 0.15);
          ctx.lineTo(-fish.size * 0.8, fish.size * 0.15);
          ctx.quadraticCurveTo(fish.size * 0.5, fish.size * 0.28, fish.size * 1.1, 0);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.8, 0);
          ctx.quadraticCurveTo(-fish.size * 1.2, -fish.size * 0.35 + wiggleVal, -fish.size * 1.4, wiggleVal);
          ctx.quadraticCurveTo(-fish.size * 1.2, fish.size * 0.35 + wiggleVal, -fish.size * 0.8, 0);
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(fish.size * 0.8, -fish.size * 0.05, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(fish.size * 0.82, -fish.size * 0.05, 2, 0, Math.PI * 2);
          ctx.fill();

        } else if (fish.type === 'tetra') {
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.7, fish.size * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = fish.secondaryColor || '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.ellipse(0, -fish.size * 0.05, fish.size * 0.5, fish.size * 0.07, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = fish.color;
          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.6, 0);
          ctx.lineTo(-fish.size * 1.15, -fish.size * 0.35 + wiggleVal);
          ctx.lineTo(-fish.size * 1.15, fish.size * 0.35 + wiggleVal);
          ctx.closePath();
          ctx.fill();

        } else {
          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, fish.size * 0.65, fish.size * 0.42, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-fish.size * 0.5, 0);
          ctx.lineTo(-fish.size * 1.1, -fish.size * 0.4 + wiggleVal);
          ctx.lineTo(-fish.size * 1.1, fish.size * 0.4 + wiggleVal);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // 5. Draw Water Ripples
      ripples.forEach((rp, idx) => {
        rp.radius += 2.8;
        rp.opacity -= 0.016;

        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.opacity})`;
        ctx.lineWidth = 2.0;
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
