import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="text-center p-6 md:p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          Oops… You just found an error page
        </p>
        <p className="text-gray-600 mb-6">
          We are sorry but the page you are looking for was not found.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
        >
          <svg
            className="w-6 h-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M5 12l6-6m-6 6l6 6"
            />
          </svg>
          Take me Home
        </Link>
      </div>
    </div>
  );
};

export default Missing;
