import { useState } from "react";
import axios from "axios";
import BaseURL from "../utils/BaseURL";
import swalAlert from "../utils/swalAlert";

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BaseURL}/notes`, {
        title,
        paragraph,
      });

      setTitle("");
      setParagraph("");
      setIsOpen(false);

      swalAlert("Success!", "Note created successfully", "success");

      if (onNoteAdded) {
        onNoteAdded();
      }
    } catch (error) {
      swalAlert("Error!", "Failed to create note", "error");
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New Note
        </button>
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
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNote;
