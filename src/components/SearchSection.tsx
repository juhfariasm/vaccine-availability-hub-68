import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Search, MapPin, CheckCircle, AlertCircle, Filter, ChevronLeft, ChevronRight, Navigation, Clock } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

const mockUBSData = [
  {
    id: 1,
    name: 'UBS Vila Nova',
    address: 'Rua das Flores, 123',
    distance: 1.2,
    status: 'open',
    openingHours: '07:00 - 19:00',
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
    distance: 1.8,
    status: 'open',
    openingHours: '08:00 - 18:00',
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
    distance: 2.5,
    status: 'open',
    openingHours: '07:00 - 17:00',
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
    distance: 3.1,
    status: 'open',
    openingHours: '08:00 - 20:00',
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
    distance: 3.5,
    status: 'open',
    openingHours: '07:00 - 17:00',
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
    distance: 4.2,
    status: 'closed',
    openingHours: '08:00 - 18:00',
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
  const [currentPage, setCurrentPage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const CARDS_PER_PAGE = isMobile ? 1 : 3;
  const totalPages = Math.ceil(searchResults.length / CARDS_PER_PAGE);

  const handleSearch = () => {
    let results = mockUBSData;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(ubs => 
        ubs.name.toLowerCase().includes(query) || 
        ubs.address.toLowerCase().includes(query)
      );
    }
    
    if (filterVaccine !== 'all') {
      results = results.filter(ubs => ubs.vaccines[filterVaccine as keyof typeof ubs.vaccines]);
    }
    
    setSearchResults(results);
    setCurrentPage(0);
  };

  const nextSlide = () => {
    if (totalPages > 0) {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }
  };

  const prevSlide = () => {
    if (totalPages > 0) {
      setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
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
              {searchResults.length > 0 ? (
                <div 
                  className="flex transition-transform duration-300 ease-in-out" 
                  style={{ 
                    transform: totalPages > 0 ? `translateX(-${currentPage * 100}%)` : 'translateX(0)',
                  }}
                >
                  {totalPages > 0 && Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <div 
                      key={`page-${pageIndex}`} 
                      className="flex gap-3 md:gap-6 min-w-full justify-center"
                    >
                      {searchResults
                        .slice(pageIndex * CARDS_PER_PAGE, (pageIndex + 1) * CARDS_PER_PAGE)
                        .map((ubs) => (
                          <Card 
                            key={`ubs-${ubs.id}-${pageIndex}`}
                            className="carousel-card glass-card border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-in flex-1 min-w-0 max-w-full md:max-w-[calc(33.333%-1rem)]"
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{ubs.name}</CardTitle>
                                <Badge variant="outline" className={`${ubs.status === 'open' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                  {ubs.status === 'open' ? 'Aberto' : 'Fechado'}
                                </Badge>
                              </div>
                              <div className="flex flex-col text-sm text-gray-500">
                                <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{ubs.address}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{ubs.distance} km de distância</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>{ubs.openingHours}</span>
                                </div>
                              </div>
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
                            <CardFooter>
                              <Button variant="outline" className="w-full gap-2 bg-white">
                                <Navigation className="h-4 w-4" />
                                Ver no mapa
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full text-center py-12">
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
