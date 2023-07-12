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
export interface EventBusEvents {
  'setOpenChat': [state: boolean]
}

export interface Destroyable {
  destroy: () => void
}

export type AnyFunc = (...args: unknown[]) => unknown;

export interface State {
  bottomPositionOfChatContent: number
  messageData: Message[]
  isNewChat: boolean
  changeBottomPositionOfChatContent: (position: number) => void
  createAndAddMessage: (messageText: string, userId: string) => void
  setIsNewChat: (status: boolean) => void
  createAndAddMessageFromChatBot: () => void
  updatePendingMessage: (idMessage: string, updateData: { message?: string, status: StatusMessage }) => void
}

export interface MessageMetaType {
  scenario: unknown
  message: unknown
}

export type MessageMetaData = Record<string, MessageMetaType[keyof MessageMetaType] >

export interface Message {
  id: number | string
  message: string
  userId: string
  status: StatusMessage
  type: 'scenario' | 'message'
}

export enum StatusMessage {
  pending,
  success,
  failed
}
