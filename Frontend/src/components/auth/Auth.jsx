import { useContext } from "react";
import { GlobalContext } from "../../contexts/AllContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Auth = () => {
  const { pathname } = useLocation();
  const [state] = useContext(GlobalContext);

  if (state.token) return <Outlet />;
  else
    return (
      <Navigate to="/" state={pathname} replace />
    );
};

export default Auth;
