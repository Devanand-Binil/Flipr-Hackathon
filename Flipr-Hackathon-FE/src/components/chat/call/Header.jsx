export default function Header() {
  return (
    <header className="absolute top-0 w-full z-40 bg-[#222] shadow-md">
      {/* Header container */}
      <div className="p-2 flex items-center justify-between">
        {/* Return button */}
        <button
          className="btn"
          aria-label="Go back"
          title="Go back"
        >
          <span className="rotate-180 scale-150">
            <ArrowIcon className="fill-white" />
          </span>
        </button>
        {/* End-to-end encrypted text */}
        <p className="flex items-center gap-1 select-none">
          <LockIcon className="fill-white scale-75" />
          <span className="text-xs text-white font-semibold tracking-wide">
            End-to-end Encrypted
          </span>
        </p>
        {/* Add contact to call */}
        <button
          className="btn"
          aria-label="Add contact"
          title="Add contact"
        >
          <AddContactIcon className="fill-white" />
        </button>
      </div>
    </header>
  );
}
