import { cn } from "@/shared/utils/css";
import { useState } from "react";

import { Input } from "./ui/input";

export interface FilterSuggestion {
  label: string;
  prefix: string;
}

interface TextInputWithDropdownProps {
  suggestions: FilterSuggestion[];
  onFiltersChange: (filters: string[]) => void;
}

export default function TextInputWithDropdow({
  suggestions,
  onFiltersChange,
}: TextInputWithDropdownProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const filters = value.split(",").map((filter) => filter.trim());
    const lastFilter = filters[filters.length - 1];

    const existingPrefixes = filters
      .map((filter) => {
        const match = suggestions.find((f) => filter.startsWith(f.prefix));
        return match ? match.prefix : null;
      })
      .filter(Boolean);

    const newSuggestions = suggestions.filter(
      (filter) =>
        filter.prefix.startsWith(lastFilter) &&
        !existingPrefixes.includes(filter.prefix),
    );

    setFilteredSuggestions(newSuggestions);
    setShowDropdown(newSuggestions.length > 0);

    onFiltersChange(filters.filter((filter) => filter !== ""));
  };

  const handleSelectSuggestion = (prefix: string) => {
    const filters = query.split(",").map((filter) => filter.trim());
    filters[filters.length - 1] = prefix;

    const updatedQuery = filters.join(", ") + " ";
    setQuery(updatedQuery);
    setShowDropdown(false);

    onFiltersChange(filters);
  };

  return (
    <div className="relative">
      <Input
        placeholder="Search query (e.g. orderId:..., status:...)"
        value={query}
        onChange={handleInputChange}
        className="border-gray-300"
      />
      {showDropdown && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-background shadow-md">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.prefix}
              className={cn("cursor-pointer px-4 py-2 hover:bg-gray-100")}
              onClick={() => handleSelectSuggestion(suggestion.prefix)}
            >
              {suggestion.label} ({suggestion.prefix})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
