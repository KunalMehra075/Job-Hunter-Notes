import { useState } from "react";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";

import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${BaseURL}/notes`, {
        title,
        paragraph,
      });

      setTitle("");
      setParagraph("");
      setIsOpen(false);
      toast.success("Note created successfully");

      if (onNoteAdded) {
        onNoteAdded();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-600 flex items-center justify-center gap-2 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Add New Note <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Add New Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="paragraph"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Paragraph
              </label>
              <textarea
                id="paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 h-32"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {isLoading ? "Saving..." : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNote;
