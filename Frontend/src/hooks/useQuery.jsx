import { useCallback, useContext, useEffect, useRef, useState } from "react";
import FetchInstance from "../utils/FetchInstance";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/AllContext";

export default function useQuery({
  method,
  path,
  query,
  options,
  skip = false,
}) {
  const navigate = useNavigate();
  const [, dispatch] = useContext(GlobalContext);
  const toastShown = useRef(false);

  const [data, setData] = useState({
    ok: false,
    status: 0,
    headers: {},
    body: {
      error: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  
  const instanceRef = useRef(new FetchInstance(import.meta.env.VITE_API_URL));

  const reFetch = useCallback(() => {
    setRefresh((r) => !r);
  }, []);

  useEffect(() => {
    if (skip) return;
    setIsLoading(true);
    instanceRef.current
      .fetch({ method, path, query, options })
      .then((data) => {
        if (data.status === 401) dispatch({ type: "SIGNOUT" });
        else if (data.status === 403) {
          if (!toastShown.current) {
            toastShown.current = true;
          }
          navigate("/dashboard");
        }
        setData(data);
      })
      .catch((e) =>
        setData({
          ok: false,
          status: 0,
          headers: {},
          body: {
            error: e.message,
          },
        })
      )
      .finally(() => setIsLoading(false));
  }, [dispatch, method, navigate, options, path, query, refresh, skip]);

  return { data, isLoading, reFetch };
}
