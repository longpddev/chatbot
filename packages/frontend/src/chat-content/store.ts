import { create } from 'zustand';
import { State, StatusMessage } from '../interface';
import { generateUniqueId } from './utils/ultis';
import { BOT_ID, CLIENT_ID, FAKE_BOT_DATA } from './utils/constants';

let indexOfAnswerChatbot = 0;

const useStore = create<State>((set, get) => ({
  bottomPositionOfChatContent: 0,
  messageData: [],
  isNewChat: true,
  changeBottomPositionOfChatContent: (position) => set(() => ({ bottomPositionOfChatContent: position })),
  createAndAddMessage: (messageText, userId) => {
    const { isNewChat, messageData, setIsNewChat, createAndAddMessageFromChatBot } = get()

    const newMessage = {
      id: generateUniqueId(),
      message: messageText,
      userId,
      status: StatusMessage.pending
    }
    set(() => ({ messageData: [...messageData, newMessage] }))

    if (isNewChat && userId !== BOT_ID) {
      setIsNewChat(false)
    }

    if (userId === CLIENT_ID) {
      createAndAddMessageFromChatBot()
    }
  },
  setIsNewChat: (status) => set(() => ({ isNewChat: status })),
  createAndAddMessageFromChatBot: () => {
    const { createAndAddMessage } = get()

    const fakeDataChatBot = FAKE_BOT_DATA[indexOfAnswerChatbot] ?? [];
    fakeDataChatBot.forEach(message => {
      createAndAddMessage(message, BOT_ID);
    });

    indexOfAnswerChatbot += 1;
  }
}));

export default useStore;