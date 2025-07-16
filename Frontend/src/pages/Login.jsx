import { useContext, useState } from "react";
import { showNotification } from "../utils/toast";
import { GlobalContext } from "../contexts/AllContext";
import useMutation from "../hooks/useMutation";

const Login = () => {
  const [, dispatch] = useContext(GlobalContext);
  const { mutate, isLoading } = useMutation();
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!details.email.trim()) {
      newErrors.email = "Email Id is Required.";
    }
    if (!details.password.trim()) {
      newErrors.password = "Password is Required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const {
      ok,
      body: { data, error },
    } = await mutate({
      method: "POST",
      path: "/auth/signin",
      options: {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(details),
      },
    });

    if (ok) {
      showNotification("success", data.message);
      dispatch({ type: "SIGNIN", payload: data });
    } else showNotification("error", error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-soft-pink to-light-blue">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Welcome
        </h2>
        <p className="text-sm text-center text-gray-600 mb-8">
          Please sign in to your account to continue.
        </p>
        <form onSubmit={onSubmit}>
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
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={details.password}
              onChange={(e) => {
                setDetails((d) => ({
                  ...d,
                  password: e.target.value,
                }));
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-150 ease-in-out"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
