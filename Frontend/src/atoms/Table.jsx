/* eslint-disable react/prop-types */
export const Table = ({ columns, data, renderCell }) => {
  const tableData = () => {
    if (!data?.length) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-600 text-lg font-semibold">
                No data available
              </p>
            </div>
          </td>
        </tr>
      );
    } else {
      return data.map((row, index) => (
        <tr
          key={row._id || index}
          className="hover:bg-gray-50 even:bg-gray-100 odd:bg-white transition-all duration-200"
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 border-b border-gray-200"
            >
              {renderCell ? renderCell(row, column.key) : row[column.key]}
            </td>
          ))}
        </tr>
      ));
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-lg">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-sm">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold tracking-wide uppercase text-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">{tableData()}</tbody>
        </table>
      </div>
    </div>
  );
};
