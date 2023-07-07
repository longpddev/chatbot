import { useRef, useEffect } from "preact/compat";
import MessageOptions from "../MessageOptions";
import Message from "../Message";
import { shallow } from "zustand/shallow";
import useStore from "../../store";

function Conversations () {
  const contentChatRef = useRef<HTMLDivElement>(null);

  const { bottomPositionOfChatContent, messageData, isNewChat } = useStore(
    (state) => ({
      bottomPositionOfChatContent: state.bottomPositionOfChatContent,
      messageData: state.messageData,
      isNewChat: state.isNewChat
    }),
    shallow
  );

  useEffect(() => {
    const scrollToEndOfChat = () => {
      const element = contentChatRef.current;

      if (element) {
        element.scrollTop =
        element.scrollHeight;

        // const isElementReachBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 1;
      }
    };
    scrollToEndOfChat()
  }, [messageData])

  return (
    <div
      style={{ bottom: bottomPositionOfChatContent }}
      className="absolute inset-0 overflow-x-hidden overflow-y-auto px-6 pt-6"
      ref={contentChatRef}
    >
      <div className="chat-app__conversations">
        {messageData.map((message, index) => (
          <Message
            message={message}
            key={message.id}
            currentAndNextMessageIsSameUser={
              message.userId === messageData[index + 1]?.userId
            }
          />
        ))}
      </div>

      {isNewChat && <MessageOptions />}
    </div>
  );
}

export default Conversations;
