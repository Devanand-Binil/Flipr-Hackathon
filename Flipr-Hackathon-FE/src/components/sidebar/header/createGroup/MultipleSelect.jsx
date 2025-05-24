import Select from "react-select";

export default function MultipleSelect({
  selectedUsers,
  setSelectedUsers,
  searchResults,
  handleSearch,
}) {
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearch(e)}
        placeholder="Search, select users"
        isMulti
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-2">
            <img
              src={user.picture}
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-gray-200">{user.label}</span>
          </div>
        )}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "transparent",
            borderColor: state.isFocused ? "#22c55e" : "transparent",
            boxShadow: state.isFocused ? "0 0 0 1px #22c55e" : "none",
            paddingLeft: "6px",
            color: "#e0e0e0",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#1f2937", // dark gray background
            color: "#e0e0e0",
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? "#22c55e"
              : isFocused
              ? "#374151"
              : "transparent",
            color: isSelected ? "#fff" : "#e0e0e0",
            cursor: "pointer",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#9ca3af", // lighter gray for placeholder
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#22c55e",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            ':hover': {
              backgroundColor: "#16a34a",
              color: "white",
            },
          }),
          input: (base) => ({
            ...base,
            color: "#e0e0e0",
          }),
          singleValue: (base) => ({
            ...base,
            color: "#e0e0e0",
          }),
        }}
      />
    </div>
  );
}
