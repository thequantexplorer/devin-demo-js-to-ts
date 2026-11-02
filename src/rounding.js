/**
 * Rounds to the nearest integer, sending exact halves to the nearest even
 * integer ("banker's rounding"). Used for all minor-unit math so that
 * totals don't drift upward over many line items.
 * @param {number} value
 * @returns {number}
 */
export function roundHalfEven(value) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Cannot round ${value}`);
  }
  const floor = Math.floor(value);
  const diff = value - floor;
  const EPSILON = 1e-9;
  if (Math.abs(diff - 0.5) < EPSILON) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return Math.round(value);
}
