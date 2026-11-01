export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededUnit(seed: number, salt = 1): number {
  const x = Math.sin(seed * 0.001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function seededRange(seed: number, min: number, max: number, salt = 1): number {
  return min + seededUnit(seed, salt) * (max - min);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
