import { create } from 'zustand';
import { State, StatusMessage } from '../interface';
import { fakeAPI, generateUniqueId } from './utils/ultis';
import { BOT_ID, CLIENT_ID, FAKE_BOT_DATA } from './utils/constants';

let indexOfAnswerChatbot = 0;

const createMessageData = (messageText: string, userId: string) => {
  const uniqueId = generateUniqueId();
  const messageData = {
    id: uniqueId,
    message: messageText,
    userId,
    status: StatusMessage.pending
  }
  return messageData
}

const useStore = create<State>((set, get) => ({
  bottomPositionOfChatContent: 0,
  messageData: [],
  isNewChat: true,
  changeBottomPositionOfChatContent: (position) => set(() => ({ bottomPositionOfChatContent: position })),
  createAndAddMessage: async (messageText, userId) => {
    const { isNewChat, messageData, setIsNewChat, createAndAddMessageFromChatBot, updatePendingMessage } = get()

    const newMessage = createMessageData(messageText, userId)
    set(() => ({ messageData: [...messageData, newMessage] }));

    if (isNewChat && userId !== BOT_ID) {
      setIsNewChat(false)
    }

    try {
      await fakeAPI();
      updatePendingMessage(newMessage.id, { status: StatusMessage.success });
    } catch {
      updatePendingMessage(newMessage.id, { status: StatusMessage.failed });
    }

    if (userId === CLIENT_ID) {
      createAndAddMessageFromChatBot()
    }
  },
  setIsNewChat: (status) => set(() => ({ isNewChat: status })),
  createAndAddMessageFromChatBot: async () => {
    const { updatePendingMessage, messageData } = get();

    const newMessage = createMessageData("", BOT_ID)
    set(() => ({ messageData: [...messageData, newMessage] }));

    try {
      await fakeAPI();
      const fakeDataChatBot = FAKE_BOT_DATA[indexOfAnswerChatbot] ?? "I don't have a answer.";

      updatePendingMessage(newMessage.id, {
        status: StatusMessage.success,
        message: fakeDataChatBot
      });
    } catch {
      updatePendingMessage(newMessage.id, { status: StatusMessage.failed, message: "Don't generate your answer." });
    }

    indexOfAnswerChatbot += 1;
  },
  updatePendingMessage: (idMessage, updateData) => {
    const { messageData } = get();

    const index = messageData.findIndex(message => message.id === idMessage);
    if (index === -1) return;

    const newMessage = [...messageData]
    newMessage[index] = {
      ...messageData[index],
      ...updateData
    }

    set(() => ({ messageData: newMessage }))
  }
}));

export default useStore;