
import { useState } from "react";

import { SearchBar } from "../shared/searchBar";
import CarGrid from "../Cars/CarGrid";

import { SearchFilters } from "../../redux/Search/searchTypes";

const SelfDrive = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null
  );

  const handleSearch = (filters: SearchFilters) => {
    console.log("Search filters:", searchFilters);

    setSearchFilters(filters);
  };

  return (
    <div className="relative flex min-h-[420px] w-full flex-col overflow-hidden">
      <div className="flex w-full flex-col items-center gap-8 px-4 pt-[200px]">
        {/* Search Bar */}
        <div className="w-full max-w-[500px]">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Car Cards */}
        <div className="w-full max-w-5xl">
          <CarGrid rentalMode="SELF_DRIVE" />
        </div>
      </div>
    </div>
  );
};

export default SelfDrive;

