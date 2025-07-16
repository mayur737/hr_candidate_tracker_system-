import { useEffect, useMemo, useState } from "react";
import useMutation from "../hooks/useMutation";
import { useNavigate, useParams } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { showNotification } from "../utils/toast";
import FullScreenLoader from "../atoms/FullScreenLoader";

const AddCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation();
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    experience: 0,
    status: "",
    skills: [],
    note: "",
    location: "",
  });

  const candidateQuery = useMemo(
    () => ({ method: "Get", path: `/candidate/${id}`, skip: !id }),
    [id]
  );

  const {
    data: {
      ok: candidateOk,
      body: { data: candidateData, error: candidateError },
    },
    isLoading: isLoadingCandidate,
  } = useQuery(candidateQuery);

  const candidate = candidateData?.candidate;

  useEffect(() => {
    if (candidateOk && !candidateError && !isLoadingCandidate && candidate) {
      setDetails({
        name: candidate.name || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        experience: candidate.experience || 0,
        status: candidate.status || "",
        skills: candidate.skills || [],
        note: candidate.note || "",
        location: candidate.location || "",
      });
    } else if (candidateError) {
      showNotification("error", candidateError);
    }
  }, [candidate, candidateError, candidateOk, isLoadingCandidate]);

  const validate = () => {
    let formErrors = {};
    if (!details.name) {
      formErrors.name = "Name is required";
    }
    if (!details.email) {
      formErrors.email = "Email Id is required";
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      formErrors.email = "Email Id is invalid";
    }
    if (!details.status) {
      formErrors.status = "Status is required";
    }
    if (!details.skills.length) {
      formErrors.skills = "At least one skill is required";
    }
    if (details.status === "Optional" && !details.note.trim()) {
      formErrors.note = "Note is required when status is Optional";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const {
        ok,
        body: {
          data: { message },
          error,
        },
      } = await mutate({
        method: id ? "PUT" : "Post",
        path: id ? `/candidate/${id}` : "/candidate",
        options: {
          headers: { "content-type": "application/json" },
          body: JSON.stringify(details),
        },
      });
      if (ok) {
        showNotification("success", message);
        navigate("/candidates");
      } else {
        showNotification("error", error || "Something went wrong");
      }
    } catch (error) {
      showNotification("error", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {(isLoading || isLoadingCandidate) && <FullScreenLoader />}
      <div className="w-full md:w-3/4  max-w-3xl bg-white rounded-xl shadow-custom1 p-8 my-8 mx-4 transform transition-all duration-300 ease-in-out">
        <h2 className="text-2xl mt-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-center mb-6">
          {id ? "Edit Candidate" : "Add Candidate"}
        </h2>
        <hr className="border-gray-300 mb-6 mt-4" />
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={details.name}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  name: e.target.value,
                }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Id
            </label>
            <input
              type="email"
              id="email"
              value={details.email}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  email: e.target.value,
                }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Email Id"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="text"
              id="phone"
              value={details.phone}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  phone: e.target.value,
                }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Contact Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="experience"
              className="block text-sm font-semibold text-gray-700"
            >
              Experience (In Years)
            </label>
            <input
              type="number"
              id="experience"
              value={details.experience}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  experience: e.target.value,
                }));
                if (errors.experience)
                  setErrors((prev) => ({ ...prev, experience: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Experience (In Years)"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-700"
            >
              Location
            </label>
            <input
              type="number"
              id="location"
              value={details.location}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  location: e.target.value,
                }));
                if (errors.location)
                  setErrors((prev) => ({ ...prev, location: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="skills"
              className="block text-sm font-semibold text-gray-700"
            >
              Skills
            </label>
            <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg px-4 py-3 mt-2">
              {details.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setDetails((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Type and press enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    const newSkill = e.target.value.trim();
                    if (!details.skills.includes(newSkill)) {
                      setDetails((prev) => ({
                        ...prev,
                        skills: [...prev.skills, newSkill],
                      }));
                    }
                    e.target.value = "";
                  }
                }}
                className="flex-1 border-none focus:outline-none text-sm"
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              value={details.status}
              onChange={(e) => {
                setDetails((prev) => ({ ...prev, status: e.target.value }));
                if (errors.status)
                  setErrors((prev) => ({ ...prev, status: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
            >
              <option value="">Select Status</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Interested">Interested</option>
              <option value="Connected">Connected</option>
              <option value="Not Connected">Not Connected</option>
              <option value="Optional">Optional</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          {details.status === "Optional" && (
            <div className="mb-6">
              <label
                htmlFor="note"
                className="block text-sm font-semibold text-gray-700"
              >
                Note
              </label>
              <textarea
                id="note"
                value={details.note}
                onChange={(e) => {
                  setDetails((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }));
                  if (errors.note) setErrors((prev) => ({ ...prev, note: "" }));
                }}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
                placeholder="Enter note here..."
              />
              {errors.note && (
                <p className="text-red-500 text-sm mt-1">{errors.note}</p>
              )}
            </div>
          )}
          <div className="flex justify-center items-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white rounded-md p-3 mt-4 focus:outline-none focus:ring-2 focus:ring-green-800 hover:bg-green-700 transition duration-200"
            >
              {id ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidate;
