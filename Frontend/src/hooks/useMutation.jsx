import { useCallback, useContext, useRef, useState } from "react";
import FetchInstance from "../utils/FetchInstance";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/AllContext";

export default function useMutation() {
  const navigate = useNavigate();
  const [, dispatch] = useContext(GlobalContext);
  const toastShown = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const instanceRef = useRef(new FetchInstance(import.meta.env.VITE_API_URL));

  const mutate = useCallback(
    async ({ method, path, query, options }) => {
      setIsLoading(true);
      try {
        const data = await instanceRef.current.fetch({
          method,
          path,
          query,
          options,
        });
        if (data.status === 401) dispatch({ type: "SIGNOUT" });
        else if (data.status === 403) {
          if (!toastShown.current) {
            toastShown.current = true;
          }
          navigate("/dashboard");
        }
        return data;
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          status: 0,
          headers: {},
          body: {
            error: error.message,
          },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, navigate]
  );

  return { mutate, isLoading };
}
