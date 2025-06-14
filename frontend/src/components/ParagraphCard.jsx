import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ClipboardDocumentIcon,
  PencilIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import swalAlert from "../utils/swalAlert";
import highlightText from "../utils/textHighlighter";

const ParagraphCard = ({ title, paragraph, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedParagraph, setEditedParagraph] = useState(paragraph);
  const [copied, setCopied] = useState(false);
  const companyName = useSelector((state) => state.company.companyName);
  const jobTitle = useSelector((state) => state.company.jobTitle);
  const jobLink = useSelector((state) => state.company.jobLink);
  const personName = useSelector((state) => state.company.personName);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return;
    }

    const textToCopy = `${editedParagraph}`
      .replace(/{{companyName}}/g, companyName)
      .replace(/{{jobTitle}}/g, jobTitle)
      .replace(/{{jobLink}}/g, jobLink)
      .replace(/{{personName}}/g, personName);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSave = () => {
    onEdit(editedTitle, editedParagraph);
    setIsEditing(false);
    swalAlert("Success!", "Note updated successfully", "success");
  };

  const displayTitle = highlightText(
    editedTitle,
    companyName,
    jobTitle,
    jobLink,
    personName
  );
  const displayParagraph = highlightText(
    editedParagraph,
    companyName,
    jobTitle,
    jobLink,
    personName
  );

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg break-inside-avoid max-h-[65vh] flex flex-col transition-all duration-300">
      {isEditing ? (
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <p className="text-white">Change Title</p>
          <input
            type="text"
            value={editedTitle}
            placeholder="Enter your title here..."
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <p className="text-white">Change Paragraph</p>
          <textarea
            value={editedParagraph}
            placeholder="Enter your paragraph here..."
            rows={15}
            onChange={(e) => setEditedParagraph(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white flex-1"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <>
          <h3
            className="text-xl font-semibold mb-2 break-words"
            dangerouslySetInnerHTML={{ __html: displayTitle }}
          />
          <div className="flex-1 overflow-hidden">
            <p
              className="text-gray-300 mb-4 break-words whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: displayParagraph }}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={onDelete}
              className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              title="Copy"
            >
              {copied ? (
                <CheckCircleIcon color="green" className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-gray-700 rounded cursor-pointer"
              title="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ParagraphCard;
