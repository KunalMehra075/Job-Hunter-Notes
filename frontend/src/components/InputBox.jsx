import { useDispatch, useSelector } from "react-redux";
import {
  setCompanyName,
  setJobLink,
  setJobTitle,
  setPersonName,
} from "../store/companySlice";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";

const formattedCompanyName = "{{companyName}}";
const formattedJobTitle = "{{jobTitle}}";
const formattedJobLink = "{{jobLink}}";
const formattedPersonName = "{{personName}}";

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
    <Card className="container mx-auto mb-6  p-0 ">
      <CardContent className="py-6 m-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-0">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-base font-medium">
              <span
                onClick={handleCopy}
                title="Click to copy to clipboard"
                className="bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded cursor-pointer hover:bg-green-500/30 transition-colors"
              >
                {formattedCompanyName}
              </span>
            </Label>
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={handleChange}
              placeholder="Enter company name..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-base font-medium">
              <span
                onClick={handleCopy}
                title="Click to copy to clipboard"
                className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded cursor-pointer hover:bg-blue-500/30 transition-colors"
              >
                {formattedJobTitle}
              </span>
            </Label>
            <Input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={handleJobTitleChange}
              placeholder="Enter job title..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobLink" className="text-base font-medium">
              <span
                onClick={handleCopy}
                title="Click to copy to clipboard"
                className="bg-pink-500/20 text-pink-600 dark:text-pink-400 px-2 py-1 rounded cursor-pointer hover:bg-pink-500/30 transition-colors"
              >
                {formattedJobLink}
              </span>
            </Label>
            <Input
              type="text"
              id="jobLink"
              value={jobLink}
              onChange={handleJobLinkChange}
              placeholder="Enter job link..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personName" className="text-base font-medium">
              <span
                onClick={handleCopy}
                title="Click to copy to clipboard"
                className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded cursor-pointer hover:bg-yellow-500/30 transition-colors"
              >
                {formattedPersonName}
              </span>
            </Label>
            <Input
              type="text"
              id="personName"
              value={personName}
              onChange={handlePersonNameChange}
              placeholder="Enter person name..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputBox;
