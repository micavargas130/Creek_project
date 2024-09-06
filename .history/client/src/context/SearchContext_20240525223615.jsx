import { createContext, useReducer } from "react";

const INITIAL_STATE = {
    dates: [], // Asegúrate de que dates esté inicializado como una lista vacía
    options: {
      adult: 1,
      children: 0,
      room: 1,
    },
  };
  
export const SearchContext = createContext(INITIAL_STATE);

const searchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
// context/SearchContext.js


export const SearchProvider = ({ children }) => {
  const [dates, setDates] = useState([]);
  const [options, setOptions] = useState({ adult: 1, children: 0 });

  return (
    <SearchContext.Provider value={{ dates, setDates, options, setOptions }}>
      {children}
    </SearchContext.Provider>
  );
};



