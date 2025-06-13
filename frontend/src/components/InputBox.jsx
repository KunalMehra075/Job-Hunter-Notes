import { useDispatch, useSelector } from "react-redux";
import { setCompanyName } from "../store/companySlice";

const InputBox = () => {
  const dispatch = useDispatch();
  const companyName = useSelector((state) => state.company.companyName);

  const handleChange = (e) => {
    dispatch(setCompanyName(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <input
        type="text"
        value={companyName}
        onChange={handleChange}
        placeholder="Enter company name..."
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default InputBox;
