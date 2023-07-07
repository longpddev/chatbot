import clsx from "clsx";
import { CLIENT_ID, MESSAGE_OPTIONS } from "../../utils/constants";
import "./index.scss";
import useStore from "../../store";

function MessageOptions () {
  const createAndAddMessage = useStore((state) => state.createAndAddMessage)

  if (MESSAGE_OPTIONS.length === 0) return null;
  return (
    <div className="absolute left-0 right-0 bottom-0 px-[26px] pt-[13px] pb-[6px]">
      {MESSAGE_OPTIONS.map((option, index) => (
        <div
          className={clsx("flex justify-end", {
            "mt-3": index !== 0
          })}
          key={index}
        >
          <button className="option-button" onClick={() => createAndAddMessage(option, CLIENT_ID)}>{option}</button>
        </div>
      ))}
    </div>
  );
}

export default MessageOptions;
