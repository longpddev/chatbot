export interface ChatConfig {
  container: string
  position: "left" | "right"
  positionLeft: number
  positionRight: number
  positionBottom: number
}

export type ChatConfigKeys = [
  "container",
  "position",
  "positionBottom",
  "positionLeft",
  "positionRight"
];

export interface Destroyable {
  destroy: () => void
}

export type AnyFunc = (...args: unknown[]) => unknown;
