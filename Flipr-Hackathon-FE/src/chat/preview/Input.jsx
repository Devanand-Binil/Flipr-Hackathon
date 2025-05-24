export default function Input({ message, setMessage }) {
  return (
    <div className="w-full max-w-[60%] rounded-lg dark:bg-dark_hover_1 border border-transparent focus-within:border-green_1 transition-all">
      {/* Message input */}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-transparent h-11 pl-3 pr-2 rounded-lg focus:outline-none dark:text-dark_text_1"
      />
    </div>
  );
}
