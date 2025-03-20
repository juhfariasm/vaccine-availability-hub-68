
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchFilters, ViewToggle } from './ubs/SearchFilters';
import UBSCardView from './ubs/UBSCardView';
import UBSTableView from './ubs/UBSTableView';
import EmptyResults from './ubs/EmptyResults';
import { UBSItem } from '@/types/ubs';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/hooks/use-database';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVaccine, setFilterVaccine] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchResults, setSearchResults] = useState<UBSItem[]>([]);
  const { toast } = useToast();
  const { isConnected, isLoading, ubsList } = useDatabase();
  
  // Converter dados do banco para o formato UBSItem
  const convertToUBSItem = (dbData: any[]): UBSItem[] => {
    try {
      return dbData.map(ubs => {
        // Mapear vacinas para o formato esperado
        const vaccines: { [key: string]: boolean } = {};
        
        if (ubs.vaccines && Array.isArray(ubs.vaccines)) {
          ubs.vaccines.forEach((vaccine: any) => {
            vaccines[vaccine.name] = vaccine.UBSVaccine?.available || false;
          });
        }
        
        return {
          id: ubs.id,
          name: ubs.name,
          address: ubs.address,
          distance: 0, // Calcular distância se tivermos geolocalização
          status: ubs.status === "Aberto" ? "open" : "closed",
          openingHours: ubs.openingHours,
          vaccines
        };
      });
    } catch (error) {
      console.error('Error converting UBS data:', error);
      return [];
    }
  };
  
  // Efeito para processar os dados iniciais do banco
  useEffect(() => {
    if (!isLoading && ubsList.length > 0) {
      const convertedData = convertToUBSItem(ubsList);
      setSearchResults(convertedData);
    }
  }, [isLoading, ubsList]);
  
  const handleSearch = () => {
    if (isLoading || ubsList.length === 0) {
      toast({
        title: "Dados não disponíveis",
        description: "Aguarde o carregamento dos dados ou verifique a conexão com o banco.",
        variant: "destructive"
      });
      return;
    }
    
    let results = convertToUBSItem(ubsList);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(ubs => 
        ubs.name.toLowerCase().includes(query) || 
        ubs.address.toLowerCase().includes(query)
      );
    }
    
    if (filterVaccine !== 'all') {
      results = results.filter(ubs => ubs.vaccines[filterVaccine]);
    }
    
    if (filterCity !== 'all') {
      results = results.filter(ubs => ubs.address.includes(filterCity));
    }
    
    setSearchResults(results);
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
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do banco...</p>
          </div>
        ) : !isConnected ? (
          <div className="text-center py-12 bg-red-50 rounded-lg p-6">
            <p className="text-red-600 font-medium mb-2">Não foi possível conectar ao banco de dados</p>
            <p className="text-gray-600">Mostrando dados mockados para demonstração</p>
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
