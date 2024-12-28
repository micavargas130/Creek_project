import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  dates: [],
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
  searchKey: 0, // Nuevo estado para forzar re-renderizado
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return { ...action.payload, searchKey: state.searchKey + 1 }; // Incrementa searchKey
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
};
