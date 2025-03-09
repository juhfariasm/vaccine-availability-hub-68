import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, CheckCircle, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from 'react';

// Mock data of UBSs and vaccines
const mockUBSData = [
  {
    id: 1,
    name: 'UBS Vila Nova',
    address: 'Rua das Flores, 123',
    vaccines: {
      "COVID-19": true,
      "Gripe": true,
      "Febre Amarela": false,
      "Tétano": true,
      "Hepatite B": true,
      "Sarampo": false
    }
  },
  {
    id: 2,
    name: 'UBS Central',
    address: 'Av. Principal, 500',
    vaccines: {
      "COVID-19": true,
      "Gripe": false,
      "Febre Amarela": true,
      "Tétano": true,
      "Hepatite B": false,
      "Sarampo": true
    }
  },
  {
    id: 3,
    name: 'UBS Jardim América',
    address: 'Rua dos Ipês, 78',
    vaccines: {
      "COVID-19": false,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": false,
      "Hepatite B": true,
      "Sarampo": true
    }
  },
  {
    id: 4,
    name: 'UBS Parque das Árvores',
    address: 'Alameda dos Cedros, 45',
    vaccines: {
      "COVID-19": true,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": true,
      "Hepatite B": true,
      "Sarampo": false
    }
  },
  {
    id: 5,
    name: 'UBS São João',
    address: 'Rua dos Pinheiros, 89',
    vaccines: {
      "COVID-19": true,
      "Gripe": false,
      "Febre Amarela": false,
      "Tétano": true,
      "Hepatite B": false,
      "Sarampo": true
    }
  },
  {
    id: 6,
    name: 'UBS Boa Vista',
    address: 'Av. das Palmeiras, 321',
    vaccines: {
      "COVID-19": false,
      "Gripe": true,
      "Febre Amarela": true,
      "Tétano": false,
      "Hepatite B": true,
      "Sarampo": false
    }
  }
];

const vaccinesList = ["COVID-19", "Gripe", "Febre Amarela", "Tétano", "Hepatite B", "Sarampo"];

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVaccine, setFilterVaccine] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchResults, setSearchResults] = useState(mockUBSData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = useRef<number>(0);

  const handleSearch = () => {
    let results = mockUBSData;
    
    // Filter by search query (UBS name or address)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(ubs => 
        ubs.name.toLowerCase().includes(query) || 
        ubs.address.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected vaccine
    if (filterVaccine !== 'all') {
      results = results.filter(ubs => ubs.vaccines[filterVaccine as keyof typeof ubs.vaccines]);
    }
    
    setSearchResults(results);
  };

  const getVisibleCardsCount = () => {
    if (typeof window === 'undefined' || !carouselRef.current) return 1;
    
    const containerWidth = carouselRef.current.clientWidth;
    // Assuming each card should be ~320px with gap
    return Math.max(1, Math.floor(containerWidth / 340));
  };

  const visibleCardsCount = getVisibleCardsCount();

  const nextSlide = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex + 1 >= searchResults.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex - 1 < 0 ? searchResults.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const cardElement = carouselRef.current.querySelector('.carousel-card');
        if (cardElement) {
          cardWidth.current = (cardElement as HTMLElement).offsetWidth + 24; // width + gap
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [searchResults]);

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
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white">
                  {searchResults.length} resultados
                </Badge>
                
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1" />
                  <span>Disponível</span>
                  <AlertCircle className="h-3.5 w-3.5 text-gray-400 ml-3 mr-1" />
                  <span>Indisponível</span>
                </div>
              </div>
              
              <div className="flex gap-2">
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
          </CardContent>
        </Card>
        
        {viewMode === 'cards' ? (
          <div className="relative">
            {searchResults.length > 0 && (
              <>
                <Button
                  onClick={prevSlide}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full p-0 bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-teal-50"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </Button>
                
                <Button
                  onClick={nextSlide}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full p-0 bg-white/80 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-teal-50"
                  aria-label="Próximo"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </Button>
              </>
            )}
            
            <div 
              ref={carouselRef}
              className="overflow-hidden"
            >
              <div 
                className="flex transition-transform duration-300 ease-in-out gap-6" 
                style={{ 
                  transform: `translateX(-${currentCardIndex * 100 / visibleCardsCount}%)`,
                  width: `${(searchResults.length / visibleCardsCount) * 100}%`
                }}
              >
                {searchResults.map((ubs) => (
                  <Card 
                    key={ubs.id} 
                    className="carousel-card glass-card border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-in flex-1 min-w-0"
                    style={{ width: `calc(${100 / searchResults.length}% - ${(searchResults.length - 1) * 24 / searchResults.length}px)` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{ubs.name}</CardTitle>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {ubs.address}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium mb-3">Vacinas:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(ubs.vaccines).map(([vaccine, available]) => (
                          <div 
                            key={vaccine} 
                            className={`text-xs rounded-full px-3 py-1.5 flex items-center justify-center font-medium ${
                              available 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {available ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {vaccine}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="glass-card border-gray-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow>
                  <TableHead className="w-[240px]">UBS</TableHead>
                  <TableHead className="w-[180px]">Endereço</TableHead>
                  {vaccinesList.map(vaccine => (
                    <TableHead key={vaccine} className="text-center">
                      {vaccine}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((ubs) => (
                  <TableRow key={ubs.id} className="hover:bg-gray-50/80">
                    <TableCell className="font-medium">{ubs.name}</TableCell>
                    <TableCell className="text-gray-600">{ubs.address}</TableCell>
                    {vaccinesList.map(vaccine => (
                      <TableCell key={vaccine} className="text-center">
                        {ubs.vaccines[vaccine as keyof typeof ubs.vaccines] ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        
        {searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar seus filtros ou buscar por outro termo.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchSection;
