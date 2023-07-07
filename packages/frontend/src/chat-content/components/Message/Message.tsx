import clsx from "clsx";
import { FunctionalComponent } from "preact";
import { Message as MessageInterFace } from "../../../interface";
import { CLIENT_ID } from "../../utils/constants";

interface MessageProps {
  message: MessageInterFace
  currentAndNextMessageIsSameUser: boolean
}

const Message: FunctionalComponent<MessageProps> = ({ message, currentAndNextMessageIsSameUser }) => {
  // const { isYou } = message;
  const isYou = message.userId === CLIENT_ID

  return (
    <div className="chat-app__message mb-4">
      <div
        className={clsx(
          "flex items-center relative",
          {
            'me justify-end': isYou
          }
        )}
      >
        {!isYou && !currentAndNextMessageIsSameUser && (
          <div className="avatar absolute left-0 bottom-[10px]">
            <img
              src="https://static.intercomassets.com/avatars/5721047/square_128/Untitled_%2825_%C3%97_25_cm%29_%286%29-min-1666925264.png"
              alt="Francisca profile"
            />
          </div>
        )}

        <div
          className={clsx("chat-app__message__wrapper", {
            "flex justify-end": isYou
          })}
        >
          <div
            className={clsx(
              "chat-app__message__content bg-gray-300 px-[20px] py-[17px] text-black w-max rounded-[10px] max-w-full",
              {
                "bg-primary text-white": isYou
              }
            )}
          >
            {message.message}
          </div>
        </div>
      </div>
      {/* <div className="chat-app__message__timestamp text-gray-200 text-[13px] pt-[7px]">
        2d ago.
      </div> */}
    </div>
  );
};

export default Message;
