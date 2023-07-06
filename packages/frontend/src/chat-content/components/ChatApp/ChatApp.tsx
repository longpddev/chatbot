import Conversations from "../Conversations"
import HeaderChatApp from "../HeaderChatApp"
import ReplyMessage from "../ReplyMessage"

function ChatApp () {
  return (
    <div className="chat-app shadow-wrapper rounded-2xl overflow-hidden">
      <HeaderChatApp />
      <div className="chat-app__main relative">
        <Conversations />
        <ReplyMessage />
      </div>
    </div>
  )
}

export default ChatApp