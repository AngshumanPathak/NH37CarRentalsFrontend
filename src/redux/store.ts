import { createStore, combineReducers } from "redux";
import searchReducer from "../redux/Search/searchReducer"

const rootReducer = combineReducers({
  search: searchReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
