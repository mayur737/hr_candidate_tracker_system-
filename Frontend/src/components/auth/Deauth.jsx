import { useContext } from "react";
import { GlobalContext } from "../../contexts/AllContext";
import { Navigate, Outlet } from "react-router-dom";

const DeAuth = () => {
  const [state] = useContext(GlobalContext);

  if (!state.token) return <Outlet />;
  else return <Navigate to="/dashboard" replace />;
};

export default DeAuth;
