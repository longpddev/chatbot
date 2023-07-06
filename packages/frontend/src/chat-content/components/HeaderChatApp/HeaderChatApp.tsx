function HeaderChatApp () {
  return (
    <div className="chat-app__header flex items-center gap-3 bg-primary text-white p-2">
      <div className="avatar">
        <img
          src="https://static.intercomassets.com/avatars/5721047/square_128/Untitled_%2825_%C3%97_25_cm%29_%286%29-min-1666925264.png"
          alt="Francisca profile"
        />
      </div>
      <div>
        <p className="font-semibold text-base">Carlburg</p>
        <p className="text-black-100">Active 1h ago</p>
      </div>
    </div>
  );
}

export default HeaderChatApp;
