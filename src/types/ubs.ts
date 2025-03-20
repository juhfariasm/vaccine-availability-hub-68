
export interface UBSItem {
  id: number;
  name: string;
  address: string;
  distance: number;
  status: 'open' | 'closed' | string; // Atualizando para aceitar string
  openingHours: string;
  vaccines: {
    [key: string]: boolean;
  } | Array<{ name: string; available: boolean }>;
}

export interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterVaccine: string;
  setFilterVaccine: (value: string) => void;
  filterCity: string;
  setFilterCity: (value: string) => void;
  handleSearch: () => void;
  vaccineOptions?: string[];
  cityOptions?: string[];
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
