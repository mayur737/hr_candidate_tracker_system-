import { useReducer } from "react";
import { GlobalContext } from "./AllContext";

const localState = localStorage.getItem("auth");

const defaultState = {
  token: "",
  hr: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  let mods = state;

  switch (type) {
    case "SIGNIN":
      mods = payload;
      break;

    case "SIGNOUT":
      mods = defaultState;
      break;
  }

  if (state !== mods) localStorage.setItem("auth", JSON.stringify(mods));

  return mods;
};

// eslint-disable-next-line react/prop-types
export function ContextProvider({ children }) {
  const reduced = useReducer(
    reducer,
    localState ? JSON.parse(localState) : defaultState
  );
  return (
    <GlobalContext.Provider value={reduced}>{children}</GlobalContext.Provider>
  );
}
