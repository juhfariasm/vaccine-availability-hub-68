
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getNearbyUBS } from '@/services/ubsService';
import { UBSItem } from '@/types/ubs';
import { useToast } from '@/hooks/use-toast';

const NearbyUBS = () => {
  const [nearbyUBS, setNearbyUBS] = useState<UBSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carrega as UBSs próximas ao montar o componente
    fetchNearbyUBS();
  }, []);

  const fetchNearbyUBS = async () => {
    try {
      setLoading(true);
      setLocationError(false);
      
      // Simular obtenção de geolocalização
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Em um app real, enviaríamos as coordenadas para o servidor
            console.log('User location:', position.coords.latitude, position.coords.longitude);
            
            // Como não estamos enviando coordenadas, apenas buscamos as UBSs mais próximas
            const nearby = await getNearbyUBS(3);
            setNearbyUBS(nearby);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationError(true);
            loadFallbackData();
          }
        );
      } else {
        // Navegador não suporta geolocalização
        setLocationError(true);
        loadFallbackData();
      }
    } catch (error) {
      console.error('Erro ao buscar UBSs próximas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as UBSs próximas",
        variant: "destructive"
      });
      loadFallbackData();
    }
  };

  const loadFallbackData = async () => {
    try {
      // Mesmo sem localização, carregamos algumas UBSs
      const nearby = await getNearbyUBS(3);
      setNearbyUBS(nearby);
    } catch (error) {
      console.error('Erro ao carregar dados de fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    fetchNearbyUBS();
  };

  return (
    <section id="nearby-ubs" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">UBSs próximas a você</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontramos as unidades básicas de saúde mais próximas da sua localização atual.
          </p>
        </div>
        
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Não foi possível obter sua localização</h3>
              <p className="text-red-700 mt-1">
                Por favor, verifique se você permitiu o acesso à sua localização no navegador.
              </p>
              <Button 
                variant="outline" 
                className="mt-3 bg-white" 
                onClick={handleGetLocation}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyUBS.map((ubs, index) => (
              <Card key={ubs.id} className="glass-card overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-in flex flex-col h-[420px]" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{ubs.name}</CardTitle>
                    <Badge variant="outline" className={`${ubs.status === 'open' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {ubs.status === 'open' ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-gray-500">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {ubs.distance} km de distância
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 flex-1 flex flex-col">
                  <div className="mb-3 h-12">
                    <p className="mb-1">{ubs.address}</p>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{ubs.openingHours}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <p className="text-sm font-medium mb-2">Vacinas disponíveis:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ubs.vaccines).map(([name, available]) => (
                        <div 
                          key={name} 
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
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="outline" className="w-full gap-2 bg-white">
                    <Navigation className="h-4 w-4" />
                    Ver no mapa
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="rounded-full bg-white text-teal-600 border-teal-200 hover:border-teal-400"
            onClick={handleGetLocation}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Atualizar localização
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NearbyUBS;
