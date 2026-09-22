import { SET_SEARCH_FILTERS } from "./searchConstants";
import { SearchFilters } from "./searchTypes";

export const setSearchFilters = (filters: SearchFilters) => ({
  type: SET_SEARCH_FILTERS,
  payload: filters,
});
