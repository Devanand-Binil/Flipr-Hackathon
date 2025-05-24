export default function UnderlineInput({ name, setName }) {
  return (
    <div className="mt-4 relative w-full">
      <input
        id="group-name-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="peer w-full bg-transparent border-b-2 border-green_1 dark:border-dark_border_1 dark:text-dark_text_1 text-lg placeholder-transparent focus:outline-none focus:border-green-500 transition"
        placeholder="Group Name"
        autoComplete="off"
      />
      <label
        htmlFor="group-name-input"
        className="absolute left-1 top-1 text-green_1 dark:text-dark_text_2 text-sm cursor-text 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                   peer-focus:top-1 peer-focus:text-green-500 peer-focus:text-sm transition-all"
      >
        Group Name
      </label>
    </div>
  );
}
