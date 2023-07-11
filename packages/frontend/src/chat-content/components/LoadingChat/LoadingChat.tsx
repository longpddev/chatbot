import "./index.scss";

function LoadingChat () {
  return (
    <div className="loader slide">
      <span className="loader__dot slide__one" />
      <span className="loader__dot" />
      <span className="loader__dot" />
      <span className="loader__dot slide__two" />
    </div>
  );
}

export default LoadingChat;
