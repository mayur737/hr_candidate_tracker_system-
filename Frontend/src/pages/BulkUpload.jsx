import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Table } from "../atoms/Table";
import useMutation from "../hooks/useMutation";
import { showNotification } from "../utils/toast";
import FullScreenLoader from "../atoms/FullScreenLoader";
import { Pagination } from "../atoms/Pagination";

const sampleData = [
  {
    Name: "Mayur Bobde",
    email: "mayur@example.com",
    phone: "1234567890",
    experience: 1,
    skills: "JavaScript, React, Node.js",
  },
  {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "9876543210",
    experience: 2,
    skills: "Python, Django, PostgreSQL",
  },
];

const BulkUpload = () => {
  const [currentItemPage, setCurrentItemPage] = useState(1);
  const [numberOfCounts, setNumberOfCounts] = useState(10);
  const { mutate, isLoading } = useMutation();
  const [details, setDetails] = useState([]);
  const [errorRows, setErrorRows] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleDownloadSample = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");

    XLSX.writeFile(wb, "Sample.xlsx");
  };

  const validateRow = (row) => {
    let errors = [];
    if (!row.name) errors.push("Name is required");
    if (!row.email) errors.push("Email Id is required");
    if (!row.phone) errors.push("Contact Number is required");
    if (!row.experience) errors.push("Experience is required");
    if (!Array.isArray(row.skills) || row.skills.length === 0)
      errors.push("At least one skill is required");
    return errors;
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0].map((h) => h.toLowerCase().trim());
      const rows = jsonData.slice(1);

      const seenEmails = new Set();
      const validRows = [];
      const errorRowsLocal = [];

      rows.forEach((rowData) => {
        const row = {};
        headers.forEach((key, idx) => {
          row[key] = rowData[idx];
        });

        const skillsRaw = row["skills"] || "";
        const skillsArray = skillsRaw
          .split(",")
          .map((skill) => skill.trim())
          .filter((s) => s);

        const mapped = {
          name: row["name"] || "",
          email: row["email"] || "",
          phone: row["phone"] || "",
          experience: row["experience"] || "",
          skills: skillsArray,
        };

        const errors = validateRow(mapped);
        if (seenEmails.has(mapped.email)) {
          errors.push("Duplicate email in file");
        }

        if (errors.length > 0) {
          errorRowsLocal.push({ ...mapped, error: errors.join("; ") });
        } else {
          seenEmails.add(mapped.email);
          validRows.push(mapped);
        }
      });

      setDetails(validRows);
      setErrorRows(errorRowsLocal);
      if (errorRowsLocal.length > 0) setShowErrorModal(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const paginatedDetails = details.slice(
    (currentItemPage - 1) * numberOfCounts,
    currentItemPage * numberOfCounts
  );
  const totalNumberOfPage = Math.ceil(details.length / numberOfCounts);
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email Id" },
    { key: "phone", label: "Contact Number" },
    { key: "experience", label: "Experience" },
    { key: "skills", label: "Skills" },
  ];

  const getValueByPath = (obj, path) => {
    const value = path.split(".").reduce((acc, part) => acc && acc[part], obj);
    if (Array.isArray(value)) return value.join(", ");
    return value || "-";
  };

  const hasErrors = details.some((row) => row.error);

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const {
        ok,
        body: {
          data: { message },
          error,
        },
      } = await mutate({
        method: "Post",
        path: `/candidate/bulk-upload`,
        options: {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(details),
        },
      });
      if (ok && message) {
        showNotification("success", message);
      } else {
        showNotification("error", error);
      }
    } catch (error) {
      showNotification("error", error);
    } finally {
      setDetails([]);
    }
  };

  return (
    <div className="content-wrapper mx-4 sm:mx-5">
      {isLoading && <FullScreenLoader />}
      <div className="sm:flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl text-center sm:text-left font-bold text-primary">
          Bulk Upload Members
        </h1>
        {details.length > 0 ? (
          !hasErrors && (
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white w-full sm:w-[30vh] py-2 mt-4 sm:mt-0 text-sm sm:text-md px-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all"
            >
              Upload
            </button>
          )
        ) : (
          <button
            onClick={handleDownloadSample}
            className="bg-blue-600 text-white w-full sm:w-[30vh] py-2 mt-4 sm:mt-0 text-sm sm:text-md px-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all"
          >
            Download Sample File
          </button>
        )}
      </div>

      {(details.length > 0 || errorRows.length > 0) && (
        <div className="mb-4 flex gap-6">
          <div>
            Total Records: <b>{details.length + errorRows.length}</b>
          </div>
          <div>
            Successful Imports: <b>{details.length}</b>
          </div>
          <div>
            Rejected Imports: <b>{errorRows.length}</b>
          </div>
        </div>
      )}
      {details.length === 0 && (
        <div className="bg-gray-100 border rounded-lg px-4 py-8">
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-8 bg-gradient-to-r from-blue-50 to-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 transition duration-300 cursor-pointer shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 w-full max-w-[600px] h-[250px] mx-auto transform hover:scale-105"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            <input
              type="file"
              id="fileInput"
              accept=".xlsx"
              className="hidden"
              ref={fileInputRef}
              onChange={handleInputChange}
            />
            <p className="text-xl font-semibold text-gray-700 mb-4 transition duration-300 ease-in-out hover:text-blue-600">
              Drag and drop an Excel file here or click to upload.
            </p>
            <p className="text-sm text-gray-500">Supported format: .xlsx</p>
          </div>
        </div>
      )}
      {details.length > 0 && (
        <>
          <Table
            columns={columns}
            data={paginatedDetails.map((row, idx) => ({ ...row, _idx: idx }))}
            renderCell={(row, key) => getValueByPath(row, key)}
          />
          <div className="mt-6">
            <Pagination
              totalPages={totalNumberOfPage || 1}
              currentPage={currentItemPage}
              setCurrentPage={setCurrentItemPage}
              numberOfCounts={numberOfCounts}
              SetNumberOfCounts={setNumberOfCounts}
            />
          </div>
        </>
      )}
      {showErrorModal && errorRows.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Rejected Records
            </h2>
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Row</th>
                    <th className="border px-2 py-1">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {errorRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{idx + 1}</td>
                      <td className="border px-2 py-1 text-red-600">
                        {row.error}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setShowErrorModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
