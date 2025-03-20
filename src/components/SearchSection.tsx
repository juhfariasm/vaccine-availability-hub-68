
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilters, ViewToggle } from './ubs/SearchFilters';
import UBSCardView from './ubs/UBSCardView';
import UBSTableView from './ubs/UBSTableView';
import EmptyResults from './ubs/EmptyResults';
import { UBSItem } from '@/types/ubs';
import { filterUBS, getAvailableCities } from '@/services/ubsService';
import { vaccinesList } from '@/data/mockUBSData';
import { toast } from '@/components/ui/use-toast';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVaccine, setFilterVaccine] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchResults, setSearchResults] = useState<UBSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  
  useEffect(() => {
    // Carrega as cidades disponíveis
    const loadCities = async () => {
      try {
        const availableCities = await getAvailableCities();
        setCities(availableCities);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar a lista de cidades.',
          variant: 'destructive',
        });
      }
    };
    
    loadCities();
    
    // Realiza a busca inicial
    handleSearch();
  }, []);
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await filterUBS(searchQuery, filterVaccine, filterCity);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar UBSs:', error);
      toast({
        title: 'Erro na busca',
        description: 'Ocorreu um erro ao buscar as UBSs. Tente novamente.',
        variant: 'destructive',
      });
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="search" className="py-24 px-6 bg-gradient-to-b from-white to-teal-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 mb-4 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
            Pesquisa avançada
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Encontre a vacina que você precisa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pesquise por nome da UBS ou selecione o tipo de vacina para ver onde está disponível.
          </p>
        </div>
        
        <Card className="glass-card bg-white/80 backdrop-blur-lg border-gray-100 shadow-sm mb-10">
          <CardHeader>
            <CardTitle className="text-xl">Filtrar vacinas</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterVaccine={filterVaccine}
              setFilterVaccine={setFilterVaccine}
              filterCity={filterCity}
              setFilterCity={setFilterCity}
              handleSearch={handleSearch}
              vaccineOptions={vaccinesList}
              cityOptions={cities}
            />
            
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultsCount={searchResults.length}
            />
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card animate-pulse h-[420px]">
                <div className="h-full flex flex-col justify-between p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              <UBSCardView searchResults={searchResults} />
            ) : (
              <UBSTableView searchResults={searchResults} />
            )}
            
            {searchResults.length === 0 && <EmptyResults />}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
