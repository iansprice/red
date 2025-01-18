// Helper function to apply skew to the phase
function skewPhase(x: number, skew: number = 0): number {
  // Normalize skew to [-1, 1] range if it's outside
  skew = Math.max(-1, Math.min(1, skew));

  // Normalize x to [0, 2π]
  const normalized = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Apply skew transformation
  if (skew === 0) return normalized;

  // Use power function for skewing
  const normalizedPercent = normalized / (2 * Math.PI);
  const power = Math.exp(skew * 2); // exponential mapping of skew
  const skewedPercent = Math.pow(normalizedPercent, power);
  return skewedPercent * 2 * Math.PI;
}


function triangleWave(x: number, skew: number = 0): number {
  const phase = 2 * skewPhase(x, skew) / Math.PI;
  if (phase < 1) return phase;
  else if (phase < 3) return 2 - phase;
  else return phase - 4;
}

function squareWave(x: number, skew: number = 0): number {
  return Math.sign(Math.sin(skewPhase(x, skew)));
}

function sawtoothWave(x: number, skew: number = 0): number {
  return (skewPhase(x, skew) / Math.PI) - 1;
}

function pulseWave(x: number, skew: number = 0, dutyCycle: number = 0.5): number {
  const normalized = skewPhase(x, skew);
  return normalized < (2 * Math.PI * dutyCycle) ? 1 : -1;
}

function trapezoidWave(x: number, skew: number = 0, rampWidth: number = Math.PI / 4): number {
  const normalized = skewPhase(x, skew);
  if (normalized < rampWidth) {
    return normalized / rampWidth;
  } else if (normalized < Math.PI) {
    return 1;
  } else if (normalized < Math.PI + rampWidth) {
    return 1 - (normalized - Math.PI) / rampWidth;
  } else {
    return -1;
  }
}

function smoothSquareWave(x: number, skew: number = 0, smoothness: number = 10): number {
  return Math.tanh(Math.sin(skewPhase(x, skew)) * smoothness);
}

function exponentialWave(x: number, skew: number = 0): number {
  const normalized = skewPhase(x, skew);
  if (normalized < Math.PI) {
    return 2 * (Math.exp(normalized / Math.PI) - 1) / (Math.E - 1) - 1;
  } else {
    return 1 - 2 * (normalized - Math.PI) / Math.PI;
  }
}

function bounceWave(x: number, skew: number = 0, bounces: number = 4): number {
  const normalized = skewPhase(x, skew);
  const t = normalized / (2 * Math.PI);
  const decay = Math.pow(2, -bounces * t);
  return Math.abs(Math.sin(2 * Math.PI * bounces * t)) * decay;
}

// Skewed sine and cosine wrappers
function skewedSin(x: number, skew: number = 0): number {
  return Math.sin(skewPhase(x, skew));
}

function skewedCos(x: number, skew: number = 0): number {
  return Math.cos(skewPhase(x, skew));
}

function skewedTan(x: number, skew: number = 0): number {
  return Math.tan(skewPhase(x, skew));
}

export const MathFunctions: {[key:string]: (x: number, skew: number) => number} = {
  "Bounce": bounceWave,
  "Exponential": exponentialWave,
  "Pulse": pulseWave,
  "Sawtooth": sawtoothWave,
  "Sin": skewedSin,
  "SmoothSquare": smoothSquareWave,
  "Square": squareWave,
  "Tan": skewedTan,
  "Trapezoid": trapezoidWave,
  "Triangle": triangleWave,
} as const;
export type MathFunction = keyof typeof MathFunctions;

export interface OscillateProps {
  cycleLengthSeconds: number;
  trigonometricFunction?: MathFunction;
  amplitudeRatio: number;
  on: boolean;
  skew: number;
  max: number;
  min: number;
  centerPhase: boolean,
}

import {type Reactive, reactive, ref, watch} from "vue"

export default function useOscillate(initial: OscillateProps = {
  max: 2500,
  min: .01,
  cycleLengthSeconds: 1.0,
  trigonometricFunction: 'Sin',
  amplitudeRatio: 1.0,
  skew: 0.5,
  on: true,
  centerPhase: false,
}) {
  let start = new Date()
  const oscillateArgs: Reactive<OscillateProps> = reactive(initial)
  watch(
    () => oscillateArgs.on,
    (on) => {
      if (on) start = new Date()
    },
    {immediate: true}
  )

  /**
   * Oscillate - Make things go back and forth
   */
  const oscillate = () => {
    const amplitudeAtMax = Math.abs(oscillateArgs.max - oscillateArgs.min) / 2;
    const mid = (oscillateArgs.max + oscillateArgs.min) / 2;
    const amplitude = oscillateArgs.amplitudeRatio * amplitudeAtMax;
    const time = (new Date().getTime() - start.getTime());
    return mid + amplitude * MathFunctions[oscillateArgs.trigonometricFunction]((Math.PI * 2.0) * (time / (oscillateArgs.cycleLengthSeconds * 1000)), oscillateArgs.skew);
  }

  return {
    oscillate,
    oscillateArgs,
  }
}