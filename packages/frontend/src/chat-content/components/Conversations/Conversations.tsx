import Message from "../Message";

function Conversations () {
  return (
    <div className="absolute bottom-[56px] inset-0 overflow-x-hidden overflow-y-auto px-6 pt-6">
      <div className="chat-app__conversations">
        {[...Array(10)].map((_, index) => (
          <Message isYou={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

export default Conversations;
