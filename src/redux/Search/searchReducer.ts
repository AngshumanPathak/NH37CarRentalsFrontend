import { SET_SEARCH_FILTERS } from "./searchConstants";
import { SearchFilters, SearchAction } from "./searchTypes";

const initialState: SearchFilters = {
  dateFrom: null,
  dateTo: null,
  category: "Select Category",
};

const searchReducer = (state = initialState, action: SearchAction): SearchFilters => {
  switch (action.type) {
    case SET_SEARCH_FILTERS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default searchReducer;
