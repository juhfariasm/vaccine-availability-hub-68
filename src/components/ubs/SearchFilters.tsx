
import { Search, Filter, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vaccinesList, citiesList } from '@/data/mockUBSData';
import { SearchFiltersProps, ViewToggleProps } from '@/types/ubs';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const SearchFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  filterVaccine, 
  setFilterVaccine,
  filterCity,
  setFilterCity, 
  handleSearch 
}: SearchFiltersProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">Selecione uma cidade</p>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="bg-white border-gray-200 w-full">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <SelectValue placeholder="Todas as cidades" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {citiesList.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar por UBS ou endereço"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        
        <Select value={filterVaccine} onValueChange={setFilterVaccine}>
          <SelectTrigger className="bg-white border-gray-200 w-full md:w-48">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filtrar por vacina" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as vacinas</SelectItem>
            {vaccinesList.map(vaccine => (
              <SelectItem key={vaccine} value={vaccine}>{vaccine}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleSearch}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export const ViewToggle = ({ viewMode, setViewMode, resultsCount }: ViewToggleProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'} mt-6`}>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-white">
          {resultsCount} resultados
        </Badge>
        
        <div className="flex items-center text-sm text-gray-500">
          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
          <span>Disponível</span>
          <AlertCircle className="h-3.5 w-3.5 text-gray-400 ml-3 mr-1" />
          <span>Indisponível</span>
        </div>
      </div>
      
      <div className="flex gap-2 self-center">
        <Button
          variant="outline"
          size="sm"
          className={`py-1 px-2 text-xs font-medium ${viewMode === 'cards' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white'}`}
          onClick={() => setViewMode('cards')}
        >
          Cartões
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`py-1 px-2 text-xs font-medium ${viewMode === 'table' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-white'}`}
          onClick={() => setViewMode('table')}
        >
          Tabela
        </Button>
      </div>
    </div>
  );
};
