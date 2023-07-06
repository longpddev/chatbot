import { SendMessageIcon } from "../../../icons/SendMessageIcon"

function ReplyMessage () {
  return (
    <div className="chat-app__reply-message">
      <textarea placeholder="Write a reply..." className="chat-app__reply-textarea" />
      <div className="absolute top-0 right-[21px]">
        <button className="mt-[2px] px-[6px] py-0 h-[51px]">
          <SendMessageIcon />
        </button>
      </div>
    </div>
  )
}

export default ReplyMessage