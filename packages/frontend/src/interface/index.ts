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

// keys is name of event, and value of keys is params of that event
export type EventBusEvents = {
  'setOpenChat': [state: boolean]
}

export interface Destroyable {
  destroy: () => void
}

export type AnyFunc = (...args: unknown[]) => unknown;
