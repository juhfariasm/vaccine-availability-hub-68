
export interface UBSItem {
  id: number;
  name: string;
  address: string;
  distance: number;
  status: 'open' | 'closed';
  openingHours: string;
  vaccines: {
    [key: string]: boolean;
  };
}

export interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterVaccine: string;
  setFilterVaccine: (value: string) => void;
  filterCity: string;
  setFilterCity: (value: string) => void;
  handleSearch: () => void;
}

export interface ViewToggleProps {
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
  resultsCount: number;
}

export interface ResultsProps {
  searchResults: UBSItem[];
  filterVaccine: string;
}
