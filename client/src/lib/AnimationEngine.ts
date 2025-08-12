// High-performance animation engine for AGORA neural network
export class AnimationEngine {
  private animationId: number | null = null;
  private lastTime = 0;
  private callbacks: Set<(deltaTime: number, time: number) => void> = new Set();
  private isRunning = false;

  // Performance metrics
  private frameCount = 0;
  private lastFpsTime = 0;
  public currentFps = 0;
  public targetFps = 120;
  public frameInterval = 1000 / this.targetFps;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  subscribe(callback: (deltaTime: number, time: number) => void) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private tick = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Frame rate control
    if (deltaTime >= this.frameInterval) {
      // Update FPS counter
      this.frameCount++;
      if (currentTime - this.lastFpsTime >= 1000) {
        this.currentFps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsTime));
        this.frameCount = 0;
        this.lastFpsTime = currentTime;
      }

      // Execute callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(deltaTime, currentTime);
        } catch (error) {
          console.warn('Animation callback error:', error);
        }
      });

      this.lastTime = currentTime;
    }

    this.animationId = requestAnimationFrame(this.tick);
  };
}

// Smooth interpolation utilities
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

export const smoothstep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Perlin noise for organic movement
class PerlinNoise {
  private gradients: number[][] = [];
  private memory: { [key: string]: number } = {};

  constructor() {
    // Generate random gradients
    for (let i = 0; i < 256; i++) {
      const angle = Math.random() * 2 * Math.PI;
      this.gradients[i] = [Math.cos(angle), Math.sin(angle)];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private dot(grad: number[], x: number, y: number): number {
    return grad[0] * x + grad[1] * y;
  }

  noise(x: number, y: number): number {
    const key = `${Math.floor(x)},${Math.floor(y)}`;
    if (this.memory[key] !== undefined) {
      return this.memory[key];
    }

    const x0 = Math.floor(x) & 255;
    const y0 = Math.floor(y) & 255;
    const x1 = (x0 + 1) & 255;
    const y1 = (y0 + 1) & 255;

    const dx0 = x - Math.floor(x);
    const dy0 = y - Math.floor(y);
    const dx1 = dx0 - 1;
    const dy1 = dy0 - 1;

    const g00 = this.gradients[x0 + y0 * 16] || [0, 0];
    const g10 = this.gradients[x1 + y0 * 16] || [0, 0];
    const g01 = this.gradients[x0 + y1 * 16] || [0, 0];
    const g11 = this.gradients[x1 + y1 * 16] || [0, 0];

    const n00 = this.dot(g00, dx0, dy0);
    const n10 = this.dot(g10, dx1, dy0);
    const n01 = this.dot(g01, dx0, dy1);
    const n11 = this.dot(g11, dx1, dy1);

    const u = this.fade(dx0);
    const v = this.fade(dy0);

    const nx0 = lerp(n00, n10, u);
    const nx1 = lerp(n01, n11, u);
    const result = lerp(nx0, nx1, v);

    this.memory[key] = result;
    return result;
  }
}

export const perlinNoise = new PerlinNoise();

// Spring physics for smooth movements
export class SpringSystem {
  private springs: Map<string, {
    current: number;
    target: number;
    velocity: number;
    stiffness: number;
    damping: number;
  }> = new Map();

  createSpring(id: string, initial = 0, stiffness = 0.15, damping = 0.8) {
    this.springs.set(id, {
      current: initial,
      target: initial,
      velocity: 0,
      stiffness,
      damping
    });
  }

  setTarget(id: string, target: number) {
    const spring = this.springs.get(id);
    if (spring) {
      spring.target = target;
    }
  }

  update(id: string, deltaTime: number): number {
    const spring = this.springs.get(id);
    if (!spring) return 0;

    const dt = Math.min(deltaTime / 16.67, 2); // Cap at 2 frames worth
    const force = (spring.target - spring.current) * spring.stiffness;
    
    spring.velocity += force * dt;
    spring.velocity *= spring.damping;
    spring.current += spring.velocity * dt;

    return spring.current;
  }

  getValue(id: string): number {
    return this.springs.get(id)?.current || 0;
  }

  isAtRest(id: string, threshold = 0.001): boolean {
    const spring = this.springs.get(id);
    if (!spring) return true;
    
    return Math.abs(spring.velocity) < threshold && 
           Math.abs(spring.target - spring.current) < threshold;
  }
}

// Global animation engine instance
export const animationEngine = new AnimationEngine();