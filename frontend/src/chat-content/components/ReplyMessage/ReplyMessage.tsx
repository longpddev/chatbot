import TextAreaAutoSize from '../TextAreaAutoSize'
import { SendMessageIcon } from "../../../icons/SendMessageIcon"
import { useEffect } from 'preact/compat';
import { useRef, useState } from 'preact/hooks';
import useStore from '../../store';
import { shallow } from 'zustand/shallow';
import { CLIENT_ID } from '../../utils/constants';

function ReplyMessage () {
  const [messageValue, setMessageValue] = useState<string>("")

  const chatReplyMessageRef = useRef<HTMLDivElement>(null);

  const {
    changeBottomPositionOfChatContent,
    createAndAddMessage,
    createAndAddMessageFromChatBot
  } = useStore(
    (state) => ({
      changeBottomPositionOfChatContent:
        state.changeBottomPositionOfChatContent,
      createAndAddMessage: state.createAndAddMessage,
      createAndAddMessageFromChatBot: state.createAndAddMessageFromChatBot
    }),
    shallow
  );

  useEffect(() => {
    createAndAddMessageFromChatBot();
  }, [createAndAddMessageFromChatBot]);

  const handleTextAreaChangeHeight = () => {
    const heightOfChatReplyMessage = chatReplyMessageRef.current?.offsetHeight ?? 0;
    changeBottomPositionOfChatContent(heightOfChatReplyMessage)
  };

  const handleAddMessage = () => {
    const trimMessageValue = messageValue.trim();

    if (!trimMessageValue) return;

    createAndAddMessage(trimMessageValue, CLIENT_ID)
    setMessageValue("")
  }

  return (
    <div className="chat-app__reply-message flex" ref={chatReplyMessageRef}>
      <TextAreaAutoSize
        placeholder="Write a reply..."
        className="chat-app__reply-textarea"
        onHeightChange={handleTextAreaChangeHeight}
        onInput={e => setMessageValue((e.target as HTMLTextAreaElement).value || '')}
        value={messageValue}
        onPressEnter={handleAddMessage}
      />
      <div className="absolute top-0 right-[21px]">
        <button className="mt-[2px] px-[6px] py-0 h-[51px]" onClick={handleAddMessage}>
          <SendMessageIcon />
        </button>
      </div>
    </div>
  );
}

export default ReplyMessage