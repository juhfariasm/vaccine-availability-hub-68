
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilters, ViewToggle } from './ubs/SearchFilters';
import UBSCardView from './ubs/UBSCardView';
import UBSTableView from './ubs/UBSTableView';
import EmptyResults from './ubs/EmptyResults';
import { UBSItem } from '@/types/ubs';
import { searchUBS } from '@/services/ubsService';
import { useToast } from '@/hooks/use-toast';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVaccine, setFilterVaccine] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchResults, setSearchResults] = useState<UBSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Carrega os dados iniciais quando o componente monta
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const results = await searchUBS('', 'all', 'all');
        setSearchResults(results);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados das UBS",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchUBS(searchQuery, filterVaccine, filterCity);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao pesquisar:', error);
      toast({
        title: "Erro na pesquisa",
        description: "Houve um problema ao buscar os dados",
        variant: "destructive"
      });
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
            />
            
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultsCount={searchResults.length}
            />
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 border-r-2 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
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
