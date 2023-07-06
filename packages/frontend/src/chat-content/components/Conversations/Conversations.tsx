import Message from "../Message";

function Conversations () {
  return (
    <div className="chat-app__main px-6 pt-6">
      <div className="chat-app__conversations">
        {[...Array(5)].map((_, index) => (
          <Message isYou={index % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

export default Conversations;
