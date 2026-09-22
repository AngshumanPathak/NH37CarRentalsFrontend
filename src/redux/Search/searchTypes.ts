export interface SearchFilters {
    dateFrom: string | null;
    dateTo: string | null;
    category: string;
  }
  
  export interface SearchAction {
    type: string;
    payload: SearchFilters;
  }
  