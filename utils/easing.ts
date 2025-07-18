type EasingFunction = (t: number) => number;
type Easing =
  | 'linear'
  | 'backInOut'
  | 'backIn'
  | 'backOut'
  | 'bounceOut'
  | 'bounceInOut'
  | 'bounceIn'
  | 'circInOut'
  | 'circIn'
  | 'circOut'
  | 'cubicInOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'elasticInOut'
  | 'elasticIn'
  | 'elasticOut'
  | 'expoInOut'
  | 'expoIn'
  | 'expoOut'
  | 'quadInOut'
  | 'quadIn'
  | 'quadOut'
  | 'quartInOut'
  | 'quartIn'
  | 'quartOut'
  | 'quintInOut'
  | 'quintIn'
  | 'quintOut'
  | 'sineInOut'
  | 'sineIn'
  | 'sineOut';

export const easing: Record<Easing, EasingFunction> = {
    // Linear
    linear: (t: number) => t,

    // Backing functions
    backInOut: (t: number) => { const s = 1.70158 * 1.525; if ((t *= 2) < 1) return 0.5 * (t * t * ((s + 1) * t - s)); return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2) },
    backIn: (t: number) => { const s = 1.70158; return t * t * ((s + 1) * t - s) },
    backOut: (t: number) => { const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },

    // Bounce functions
    bounceOut: (t: number) => { const a = 4.0 / 11.0, b = 8.0 / 11.0, c = 9.0 / 10.0, ca = 4356.0 / 361.0, cb = 35442.0 / 1805.0, cc = 16061.0 / 1805.0, t2 = t * t; return t < a ? 7.5625 * t2 : t < b ? 9.075 * t2 - 9.9 * t + 3.4 : t < c ? ca * t2 - cb * t + cc : 10.8 * t * t - 20.52 * t + 10.72 },
    bounceInOut: (t: number) => t < 0.5 ? 0.5 * (1.0 - easing.bounceOut(1.0 - t * 2.0)) : 0.5 * easing.bounceOut(t * 2.0 - 1.0) + 0.5,
    bounceIn: (t: number) => 1.0 - easing.bounceOut(1.0 - t),

    // Circular functions
    circInOut: (t: number) => { if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1); return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) },
    circIn: (t: number) => 1.0 - Math.sqrt(1.0 - t * t),
    circOut: (t: number) => Math.sqrt(1 - --t * t),

    // Cubic functions
    cubicInOut: (t: number) => t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0,
    cubicIn: (t: number) => t * t * t,
    cubicOut: (t: number) => { const f = t - 1.0; return f * f * f + 1.0 },

    // Elastic functions
    elasticInOut: (t: number) => t < 0.5 ? 0.5 * Math.sin(((+13.0 * Math.PI) / 2) * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0)) : 0.5 * Math.sin(((-13.0 * Math.PI) / 2) * (2.0 * t - 1.0 + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0,
    elasticIn: (t: number) => Math.sin((13.0 * t * Math.PI) / 2) * Math.pow(2.0, 10.0 * (t - 1.0)),
    elasticOut: (t: number) => Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * t) + 1.0,

    // Exponential functions
    expoInOut: (t: number) => t === 0.0 || t === 1.0 ? t : t < 0.5 ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0) : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0,
    expoIn: (t: number) => (t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))),
    expoOut: (t: number) => (t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)),

    // Quadric functions
    quadInOut: (t: number) => { t /= 0.5; if (t < 1) return 0.5 * t * t; t--; return -0.5 * (t * (t - 2) - 1) },
    quadIn: (t: number) => t * t,
    quadOut: (t: number) => -t * (t - 2.0),

    // Quartic functions
    quartInOut: (t: number) => t < 0.5 ? +8.0 * Math.pow(t, 4.0) : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0,
    quartIn: (t: number) => Math.pow(t, 4.0),
    quartOut: (t: number) => Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0,

    // Quintic functions
    quintInOut: (t: number) => { if ((t *= 2) < 1) return 0.5 * t * t * t * t * t; return 0.5 * ((t -= 2) * t * t * t * t + 2) },
    quintIn: (t: number) => t * t * t * t * t,
    quintOut: (t: number) => --t * t * t * t * t + 1,

    // Sine functions
    sineInOut: (t: number) => -0.5 * (Math.cos(Math.PI * t) - 1),
    sineIn: (t: number) => { const v = Math.cos(t * Math.PI * 0.5); if (Math.abs(v) < 1e-14) return 1; else return 1 - v },
    sineOut: (t: number) => Math.sin((t * Math.PI) / 2),
}