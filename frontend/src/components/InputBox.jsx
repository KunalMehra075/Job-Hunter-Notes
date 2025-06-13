import { useDispatch, useSelector } from "react-redux";
import {
  setCompanyName,
  setJobLink,
  setJobTitle,
  setPersonName,
} from "../store/companySlice";

const formattedCompanyName = "{{companyName}}";
const formattedJobTitle = "{{jobTitle}}";
const formattedJobLink = "{{jobLink}}";
const formattedPersonName = "{{personName}}";
const inputStyle =
  "w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500";

const InputBox = () => {
  const dispatch = useDispatch();
  const companyName = useSelector((state) => state.company.companyName);
  const jobTitle = useSelector((state) => state.company.jobTitle);
  const jobLink = useSelector((state) => state.company.jobLink);
  const personName = useSelector((state) => state.company.personName);

  const handleJobTitleChange = (e) => {
    dispatch(setJobTitle(e.target.value));
  };

  const handleJobLinkChange = (e) => {
    dispatch(setJobLink(e.target.value));
  };

  const handlePersonNameChange = (e) => {
    dispatch(setPersonName(e.target.value));
  };

  const handleChange = (e) => {
    dispatch(setCompanyName(e.target.value));
  };

  const handleCopy = async (e) => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return;
    }
    const textToCopy = e.target.textContent;
    await navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="w-full  mx-auto p-4 flex gap-4">
      <div className="w-full">
        <label
          htmlFor="companyName"
          className="text-lg mb-5 text-white text-bold"
        >
          Enter Company Name:{" "}
          <span
            onClick={handleCopy}
            title="Click to copy to clip-board"
            className="bg-green-500/20 text-green-400 px-1 rounded cursor-pointer hover:bg-green-500/30"
          >
            {formattedCompanyName}
          </span>
        </label>
        <input
          type="text"
          value={companyName}
          onChange={handleChange}
          placeholder="Enter company name..."
          className={inputStyle}
        />
      </div>
      <div className="w-full">
        <label htmlFor="jobTitle" className="text-lg mb-5 text-white text-bold">
          Enter Job Title:{" "}
          <span
            onClick={handleCopy}
            title="Click to copy to clip-board"
            className="bg-blue-500/20 text-blue-400 px-1 rounded cursor-pointer hover:bg-blue-500/30"
          >
            {formattedJobTitle}
          </span>
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={handleJobTitleChange}
          placeholder="Enter job title..."
          className={inputStyle}
        />
      </div>
      <div className="w-full">
        <label htmlFor="jobLink" className="text-lg mb-5 text-white text-bold">
          Enter Job Link:{" "}
          <span
            onClick={handleCopy}
            title="Click to copy to clip-board"
            className="bg-pink-500/20 text-pink-400 px-1 rounded cursor-pointer hover:bg-pink-500/30"
          >
            {formattedJobLink}
          </span>
        </label>
        <input
          type="text"
          value={jobLink}
          onChange={handleJobLinkChange}
          placeholder="Enter job link..."
          className={inputStyle}
        />
      </div>
      <div className="w-full">
        <label
          htmlFor="personName"
          className="text-lg mb-5 text-white text-bold"
        >
          Enter Person Name:{" "}
          <span
            onClick={handleCopy}
            title="Click to copy to clip-board"
            className="bg-yellow-500/20 text-yellow-400 px-1 rounded cursor-pointer hover:bg-yellow-500/30"
          >
            {formattedPersonName}
          </span>
        </label>

        <input
          type="text"
          value={personName}
          onChange={handlePersonNameChange}
          placeholder="Enter person name..."
          className={inputStyle}
        />
      </div>
    </div>
  );
};

export default InputBox;
