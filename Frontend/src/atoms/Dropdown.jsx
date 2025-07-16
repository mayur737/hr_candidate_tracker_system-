/* eslint-disable react/prop-types */
const Dropdown = ({ options = [], value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg"
    >
      {options.map((option) => (
        <option key={option.key} value={option.value} className="text-black bg-white">
          {option.key}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
