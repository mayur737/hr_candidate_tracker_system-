/* eslint-disable react/prop-types */
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  numberOfCounts,
  SetNumberOfCounts,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const countOptions = [5, 10, 15, 20];

  const getPageNumbersToShow = () => {
    let startPage = currentPage - 1;
    let endPage = currentPage + 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - 2, 1);
    }

    return pageNumbers.slice(startPage - 1, endPage);
  };

  const pagesToShow = getPageNumbersToShow();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50 shadow-md">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <label
          htmlFor="itemsPerPage"
          className="text-sm font-medium text-secondary"
        >
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          className="form-select rounded-md border-gray-300 shadow-sm text-primary"
          value={numberOfCounts}
          onChange={(e) => {
            SetNumberOfCounts(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {countOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded-full bg-white hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <AiOutlineLeft size={20} />
        </button>

        <div className="flex space-x-1">
          {pagesToShow.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-secondary hover:bg-gray-200"
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-full bg-white hover:bg-gray-200 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <AiOutlineRight size={20} />
        </button>
      </div>
      <div className="flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-end">
        <p className="text-sm font-medium text-gray-600">
          Page <span className="font-bold">{currentPage}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </p>
      </div>
    </div>
  );
};
