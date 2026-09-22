

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

import { setSearchFilters } from "../../redux/Search/searchAction";
import { SearchFilters } from "../../redux/Search/searchTypes";

export const SearchBar = ({
  onSearch,
}: {
  onSearch: (filters: SearchFilters) => void;
}) => {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const dispatch = useDispatch();

  const handleScroll = useCallback((id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }, []);

  const handleSearch = () => {
    // Validate pickup date
    if (!dateFrom) {
      alert("Please select a pickup date");
      return;
    }

    // Validate return date
    if (!dateTo) {
      alert("Please select a return date");
      return;
    }

    // Return date must be after pickup date
    if (dateFrom >= dateTo) {
      alert("Return date must be after pickup date");
      return;
    }

    const filters: SearchFilters = {
      dateFrom: format(dateFrom, "yyyy-MM-dd"),
      dateTo: format(dateTo, "yyyy-MM-dd"),
      category: ""
    };

    // Save filters in Redux
    dispatch(setSearchFilters(filters));

    // Send filters to parent
    onSearch(filters);

    // Scroll to car cards
    handleScroll("carCard");
  };

  return (
    <div className="mt-6 flex flex-col items-center sm:-mt-4">
      <h1 className="mb-5 text-4xl font-bold text-white">
        Find a Car
      </h1>

      <div className="flex flex-row">
        {/* PICKUP DATE */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-20 w-[100px] justify-start rounded-l-md bg-neutral-950 text-left font-normal text-white whitespace-normal break-words border-gray-700",
                  "sm:h-9 sm:w-[280px] sm:rounded-l-full"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {dateFrom ? (
                  format(dateFrom, "PPP")
                ) : (
                  <span>From</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* RETURN DATE */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-20 w-[100px] justify-start bg-neutral-950 text-left font-normal text-white whitespace-normal break-words border-gray-700",
                  "sm:h-9 sm:w-[280px] sm:rounded-r-full"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {dateTo ? (
                  format(dateTo, "PPP")
                ) : (
                  <span>To</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <div>
        <Button
          className="mt-8 h-10 w-40 rounded-md bg-yellow-500 text-lg font-bold"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

