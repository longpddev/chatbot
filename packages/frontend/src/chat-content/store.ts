import { create } from 'zustand';
import { State } from '../interface';
import { generateUniqueId } from './utils/ultis';
import { BOT_ID } from './utils/constants';

// let indexOfAnswerChatbot = 0;

const useStore = create<State>((set, get) => ({
  bottomPositionOfChatContent: 0,
  messageData: [],
  isNewChat: true,
  changeBottomPositionOfChatContent: (position) => set(() => ({ bottomPositionOfChatContent: position })),
  createAndAddMessage: (messageText, userId) => {
    const { isNewChat, messageData } = get()

    const newMessage = {
      id: generateUniqueId(),
      message: messageText,
      userId
    }

    const stateChanges = { messageData: [...messageData, newMessage], isNewChat }
    if (isNewChat && userId !== BOT_ID) stateChanges.isNewChat = false;

    // if (userId === CLIENT_ID) {
    //   createAndAddMessageFromChatBot()
    // }
    return set(() => (stateChanges))
  },
  setIsNewChat: (status) => set(() => ({ isNewChat: status }))
  // createAndAddMessageFromChatBot: () => {
  //   console.log('run chatbot');

  //   const { createAndAddMessage } = get()

  //   const fakeDataChatBot = FAKE_BOT_DATA[indexOfAnswerChatbot] ?? [];
  //   fakeDataChatBot.forEach(message => {
  //     createAndAddMessage(message, BOT_ID);
  //   });

  //   indexOfAnswerChatbot += 1;
  // }
}));

export default useStore;