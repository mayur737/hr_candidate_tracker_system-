import { MdAdd, MdOutlineEdit, MdOutlineUpgrade } from "react-icons/md";
import { Pagination } from "../atoms/Pagination";
import { Table } from "../atoms/Table";
import * as XLSX from "xlsx";
import FullScreenLoader from "../atoms/FullScreenLoader";
import { useEffect, useMemo, useState } from "react";
import { showNotification } from "../utils/toast";
import useQuery from "../hooks/useQuery";
import { useNavigate } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteModal from "../atoms/DeleteModal";
import Dropdown from "../atoms/Dropdown";

const statusOptions = [
  { key: "Select Status", value: "" },
  { key: "Shortlisted", value: "Shortlisted" },
  { key: "Rejected", value: "Rejected" },
  { key: "Interested", value: "Interested" },
  { key: "Not Connected", value: "Not Connected" },
];

const CandidateList = () => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState({ status: "" });
  const [numberOfCounts, SetNumberOfCounts] = useState(10);
  const [currentItemPage, SetCurrentItemPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [candidateId, setCandidateId] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      SetCurrentItemPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const adminQuery = useMemo(
    () => ({
      method: "Get",
      path: "/candidate",
      query: {
        p: currentItemPage - 1,
        n: numberOfCounts,
        status: filter.status,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      },
    }),
    [currentItemPage, numberOfCounts, filter, debouncedSearch]
  );

  const {
    data: {
      ok: candidateOk,
      body: { data: candidateData, error: candidateError },
    },
    isLoading: isLoadingAdmin,
    reFetch,
  } = useQuery(adminQuery);
  const candidateList = candidateData?.candidates ?? [];
  const totalNumberOfPage = Math.ceil(
    (candidateData?.count ?? 0) / numberOfCounts
  );

  useEffect(() => {
    if (!candidateOk && !isLoadingAdmin && candidateError)
      showNotification("error", candidateError);
  }, [isLoadingAdmin, candidateError, candidateOk]);

  const handleDelete = async () => {
    try {
      const {
        ok,
        body: {
          data: { message },
          error,
        },
      } = await mutate({ method: "DELETE", path: `/candidate/${candidateId}` });
      if (ok && message) {
        showNotification("success", message);
        setOpenDeleteModal(false);
        reFetch();
      } else {
        showNotification("error", error);
        setOpenDeleteModal(false);
        reFetch();
      }
    } catch (error) {
      showNotification("error", error);
    } finally {
      SetCurrentItemPage(1);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Contact Number" },
    { key: "email", label: "Email Id" },
    { key: "status", label: "Status" },
    { key: "skills", label: "Skills" },
    { key: "experience", label: "Experience" },
    { key: "location", label: "Location" },
    { key: "createdAt", label: "Created Date" },
    { key: "updatedAt", label: "Updated Date" },
    { key: "action", label: "Action" },
  ];

  const renderCell = (row, key) => {
    if (key === "skills")
      return Array.isArray(row.skills) ? row.skills.join(", ") : "";
    if (key === "createdAt")
      return new Date(row.createdAt).toLocaleString("en-IN");
    if (key === "updatedAt")
      return new Date(row.updatedAt).toLocaleString("en-IN");
    if (key === "action")
      return (
        <div className="flex justify-start items-center" key={row._id}>
          <MdOutlineEdit
            className="text-primary w-6 h-6 mx-2 cursor-pointer"
            title="Edit"
            onClick={() => navigate(`/edit-candidate/${row._id}`)}
          />
          |
          <MdOutlineUpgrade
            className="text-primary w-6 h-6 mx-2 cursor-pointer"
            title="Update Status"
            onClick={() => openModal(row)}
          />{" "}
          |
          <RiDeleteBinLine
            className="text-primary w-5 h-5 mx-2 cursor-pointer"
            title="Delete"
            onClick={() => {
              setCandidateId(row._id);
              setOpenDeleteModal(true);
            }}
          />
        </div>
      );
    return row[key] || "-";
  };

  const exportToExcel = async () => {
    try {
      const {
        ok,
        body: { data, error },
      } = await mutate({
        method: "GET",
        path: "/candidate",
        query: {
          n: 0,
        },
      });

      if (!ok || !data) {
        showNotification("error", error || "Failed to fetch candidates.");
        return;
      }

      const candidates = data.candidates || [];
      if (candidates.length === 0) {
        showNotification("info", "No candidates available to export.");
        return;
      }
      const formattedData = candidates.map((candidate) => ({
        Name: candidate.name,
        "Contact Number": candidate.phone,
        Status: candidate.status,
        Email: candidate.email,
        Location: candidate.location,
        Skills: Array.isArray(candidate.skills)
          ? candidate.skills.join(", ")
          : "",
        Experience: candidate.experience,
      }));
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
      XLSX.writeFile(workbook, "candidates_list.xlsx");
      showNotification("success", "Participants exported successfully!");
    } catch (error) {
      showNotification("error", error);
    }
  };

  const openModal = (member) => {
    setSelectedCandidate(member);
    setStatus(member.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
    setStatus("");
  };

  const saveStatus = async () => {
    try {
      const {
        ok,
        body: {
          data: { message },
          error,
        },
      } = await mutate({
        method: "Put",
        path: `/candidate/status/${selectedCandidate._id}`,
        options: {
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        },
      });
      if (ok && message) {
        showNotification("success", message);
        closeModal();
        reFetch();
      } else {
        showNotification("error", error);
        closeModal();
        reFetch();
      }
    } catch (error) {
      showNotification("error", error);
    } finally {
      closeModal();
    }
  };

  return (
    <div className="content-wrapper mt-5 mx-4 sm:mx-5">
      {(isLoadingAdmin || isLoading) && <FullScreenLoader />}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-2 gap-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary">
          Candidates
        </h1>
        <div className="flex flex-col lg:flex-row md:items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 flex justify-center items-center"
            onClick={exportToExcel}
          >
            Export
          </button>
          {(filter.status || debouncedSearch) && (
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 flex justify-center items-center"
              onClick={() => {
                setFilter({ status: "" });
                setSearch("");
                SetCurrentItemPage(1);
              }}
            >
              Clear filters
            </button>
          )}
          <Dropdown
            value={filter.status}
            options={statusOptions}
            onChange={(e) => setFilter({ ...filter, status: e })}
          />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md py-2 px-3 w-full sm:w-64"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition duration-300 flex justify-center items-center"
            onClick={() => navigate("/add-candidate")}
          >
            Add Candidate
            <MdAdd size={24} color="#fff" className="ml-2" />
          </button>
        </div>
      </div>
      <Table columns={columns} renderCell={renderCell} data={candidateList} />

      <div className="mt-6">
        <Pagination
          totalPages={totalNumberOfPage || 1}
          currentPage={currentItemPage}
          setCurrentPage={SetCurrentItemPage}
          numberOfCounts={numberOfCounts}
          SetNumberOfCounts={SetNumberOfCounts}
        />
      </div>
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this Candidate?"
      />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <select
              className="w-full p-2 border rounded mb-4"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                className="btn-secondary mr-2 px-4 py-2 border rounded bg-gray-200"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="btn-primary px-4 py-2 border rounded bg-blue-500 text-white"
                onClick={saveStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateList;
