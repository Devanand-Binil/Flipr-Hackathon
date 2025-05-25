import { useState } from "react";
import { ReturnIcon, ValidIcon } from "../../../../svg";
import UnderlineInput from "./UnderlineInput";
import MultipleSelect from "./MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { createGroupConversation } from "../../../../features/chatSlice";

export default function CreateGroup({ setShowCreateGroup }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.chat);

  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      setSearchResults([]);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (data.length > 0) {
          console.log("Search results:", data);
          const tempArray = data.map((u) => ({
            value: u._id,
            label: u.username,
            picture: u.picture,
          }));
          console.log("Formatted search results:", tempArray);
          setSearchResults(tempArray);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.log(error?.response?.data?.error?.message || error.message);
      }
    } else {
      setSearchResults([]);
    }
  };

  const createGroupHandler = async () => {
    if (status !== "loading" && name.trim() && selectedUsers.length > 0) {
      const users = selectedUsers.map((user) => user.value);
      const values = {
        name: name.trim(),
        users,
        token: user.token,
      };
      await dispatch(createGroupConversation(values));
      setShowCreateGroup(false);
    }
  };

  return (
    <div className="createGroupAnimation fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70 p-6">
      {/* Modal Container */}
      <div className="bg-dark_bg_3 rounded-lg w-full max-w-md p-6 relative shadow-lg">
        {/* Close button */}
        <button
          onClick={() => setShowCreateGroup(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-green_1 hover:bg-green_1 hover:text-dark_bg_3 transition"
          aria-label="Close create group"
        >
          <ReturnIcon className="fill-green_1 w-5 h-5" />
        </button>

        {/* Group Name Input */}
        <div className="mb-6">
          <UnderlineInput name={name} setName={setName} />
        </div>

        {/* Multiple Select Users */}
        <div className="mb-8">
          <MultipleSelect
            selectedUsers={selectedUsers}
            searchResults={searchResults}
            setSelectedUsers={setSelectedUsers}
            handleSearch={handleSearch}
          />
        </div>

        {/* Create Group Button */}
        <div className="flex justify-center">
          <button
            onClick={createGroupHandler}
            disabled={status === "loading" || !name.trim() || selectedUsers.length === 0}
            className={`btn bg-green_1 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-full flex items-center justify-center gap-2 transition`}
          >
            {status === "loading" ? (
              <ClipLoader color="#E9EDEF" size={25} />
            ) : (
              <>
                <ValidIcon className="fill-white h-5 w-5" />
                <span className="text-white font-semibold">Create Group</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
