export const Direction = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right",
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];
