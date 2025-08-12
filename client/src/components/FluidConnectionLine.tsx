import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { animationEngine, lerp, easeInOutCubic, perlinNoise, SpringSystem } from '@/lib/AnimationEngine';

interface Agent {
  id: string;
  position: { x: number; y: number };
  name: string;
}

interface FluidConnection {
  id: string;
  from: string;
  to: string;
  type: string;
  timestamp: number;
  confidence: number;
  isActive: boolean;
  streamProgress: number;
}

interface FluidConnectionLineProps {
  connection: FluidConnection;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

export const FluidConnectionLine: React.FC<FluidConnectionLineProps> = ({
  connection,
  from,
  to
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [animatedPoints, setAnimatedPoints] = useState<{ x: number; y: number }[]>([]);
  const springSystem = useRef(new SpringSystem());

  // Smooth position interpolation with springs
  const fromX = useSpring(from.x, { stiffness: 100, damping: 30 });
  const fromY = useSpring(from.y, { stiffness: 100, damping: 30 });
  const toX = useSpring(to.x, { stiffness: 100, damping: 30 });
  const toY = useSpring(to.y, { stiffness: 100, damping: 30 });
  
  // Stream progress animation
  const streamProgress = useSpring(connection.streamProgress, { 
    stiffness: 80, 
    damping: 25 
  });
  
  // Confidence-based pulse width
  const pulseWidth = useSpring(connection.confidence * 3, { 
    stiffness: 60, 
    damping: 20 
  });

  useEffect(() => {
    const unsubscribe = animationEngine.subscribe((deltaTime, currentTime) => {
      // Apply Perlin noise for organic drift
      const noiseScale = 0.002;
      const driftAmount = 2;
      
      const fromNoise = perlinNoise.noise(
        from.x * noiseScale, 
        currentTime * 0.0005
      ) * driftAmount;
      
      const toNoise = perlinNoise.noise(
        to.x * noiseScale, 
        currentTime * 0.0005 + 100
      ) * driftAmount;

      // Update spring targets with noise
      springSystem.current.setTarget('fromX', from.x + fromNoise);
      springSystem.current.setTarget('fromY', from.y + fromNoise * 0.5);
      springSystem.current.setTarget('toX', to.x + toNoise);
      springSystem.current.setTarget('toY', to.y + toNoise * 0.5);

      // Update spring system
      const animatedFromX = springSystem.current.update('fromX', deltaTime);
      const animatedFromY = springSystem.current.update('fromY', deltaTime);
      const animatedToX = springSystem.current.update('toX', deltaTime);
      const animatedToY = springSystem.current.update('toY', deltaTime);

      // Generate smooth curve points
      const points = [];
      const numPoints = 20;
      
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const easedT = easeInOutCubic(t);
        
        // Bezier curve for natural arc
        const midX = (animatedFromX + animatedToX) / 2;
        const midY = (animatedFromY + animatedToY) / 2 - 30; // Arc height
        
        const x = lerp(lerp(animatedFromX, midX, easedT), lerp(midX, animatedToX, easedT), easedT);
        const y = lerp(lerp(animatedFromY, midY, easedT), lerp(midY, animatedToY, easedT), easedT);
        
        points.push({ x, y });
      }
      
      setAnimatedPoints(points);
    });

    // Initialize springs
    springSystem.current.createSpring('fromX', from.x);
    springSystem.current.createSpring('fromY', from.y);
    springSystem.current.createSpring('toX', to.x);
    springSystem.current.createSpring('toY', to.y);

    return () => {
      unsubscribe();
    };
  }, [from, to, connection.id]);

  // Generate smooth path string
  const pathString = animatedPoints.length > 0 ? (() => {
    let path = `M ${animatedPoints[0].x} ${animatedPoints[0].y}`;
    
    for (let i = 1; i < animatedPoints.length - 1; i++) {
      const current = animatedPoints[i];
      const next = animatedPoints[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      
      path += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
    }
    
    if (animatedPoints.length > 1) {
      const last = animatedPoints[animatedPoints.length - 1];
      path += ` T ${last.x} ${last.y}`;
    }
    
    return path;
  })() : '';

  // Connection age for fading
  const connectionAge = Date.now() - connection.timestamp;
  const maxAge = 8000;
  const opacity = Math.max(0.1, 1 - (connectionAge / maxAge));
  
  // Confidence-based color intensity
  const confidenceColor = `hsl(${190 + connection.confidence * 50}, ${70 + connection.confidence * 30}%, ${50 + connection.confidence * 20}%)`;

  return (
    <g opacity={opacity}>
      {/* Enhanced filters for HUD beam effect */}
      <defs>
        <filter id={`neuralBeam-${connection.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="thinGlow"/>
          <feGaussianBlur stdDeviation="4" result="mediumGlow"/>
          <feGaussianBlur stdDeviation="12" result="farGlow"/>
          <feColorMatrix
            in="farGlow"
            type="matrix"
            values="0 0 0 0 0.02
                    0 0 0 0 0.7
                    0 0 0 0 0.9
                    0 0 0 1 0"/>
          <feMerge>
            <feMergeNode in="farGlow"/>
            <feMergeNode in="mediumGlow"/>
            <feMergeNode in="thinGlow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id={`streamGrad-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={confidenceColor} stopOpacity="0.2"/>
          <stop offset={`${connection.streamProgress * 100}%`} stopColor={confidenceColor} stopOpacity="1"/>
          <stop offset="100%" stopColor={confidenceColor} stopOpacity="0.3"/>
        </linearGradient>
      </defs>

      {/* Soft trail blur */}
      <motion.path
        d={pathString}
        stroke={confidenceColor}
        strokeWidth={pulseWidth}
        fill="none"
        strokeLinecap="round"
        filter={`url(#neuralBeam-${connection.id})`}
        opacity={opacity * 0.4}
        strokeDasharray="0,0"
      />
      
      {/* Active streaming line */}
      <motion.path
        ref={pathRef}
        d={pathString}
        stroke={`url(#streamGrad-${connection.id})`}
        strokeWidth={connection.confidence * 2 + 1}
        fill="none"
        strokeLinecap="round"
        opacity={connection.isActive ? 1 : 0.6}
        strokeDasharray={connection.isActive ? "10,5" : "0,0"}
        animate={{
          strokeDashoffset: connection.isActive ? [0, -15] : 0,
        }}
        transition={{
          strokeDashoffset: {
            duration: 1,
            repeat: connection.isActive ? Infinity : 0,
            ease: "linear"
          }
        }}
      />

      {/* Data packet visualization */}
      {connection.isActive && (
        <motion.circle
          r={2 + connection.confidence}
          fill={confidenceColor}
          filter={`url(#neuralBeam-${connection.id})`}
          animate={{
            r: [2 + connection.confidence, 4 + connection.confidence, 2 + connection.confidence],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <animateMotion
            dur={`${2 + Math.random()}s`}
            repeatCount="indefinite"
            path={pathString}
            begin={`${Math.random() * 2}s`}
          />
        </motion.circle>
      )}
    </g>
  );
};