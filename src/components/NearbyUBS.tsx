
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getNearbyUBS } from '@/services/ubsService';
import { toast } from '@/components/ui/use-toast';

const NearbyUBS = () => {
  const [nearbyUBS, setNearbyUBS] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    loadNearbyUBS();
  }, []);

  const loadNearbyUBS = async () => {
    setLoading(true);
    try {
      const data = await getNearbyUBS(3);
      setNearbyUBS(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar UBSs próximas:', error);
      setLoading(false);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as UBSs próximas.',
        variant: 'destructive',
      });
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setLocationError(false);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Na vida real, usaríamos as coordenadas para buscar as UBSs próximas
          // Por enquanto, apenas recarregamos os dados
          loadNearbyUBS();
        },
        () => {
          setLocationError(true);
          setLoading(false);
          toast({
            title: 'Erro de localização',
            description: 'Não foi possível obter sua localização atual.',
            variant: 'destructive',
          });
        }
      );
    } else {
      setLocationError(true);
      setLoading(false);
      toast({
        title: 'Navegador incompatível',
        description: 'Seu navegador não suporta geolocalização.',
        variant: 'destructive',
      });
    }
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
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {ubs.status === 'open' ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-gray-500">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {ubs.distance} km de distância
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 flex-1 flex flex-col">
                  <div className="mb-3 h-12"> {/* Fixed height container for address */}
                    <p className="mb-1">{ubs.address}</p>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{ubs.openingHours}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <p className="text-sm font-medium mb-2">Vacinas disponíveis:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ubs.vaccines.map((vaccine: { name: string, available: boolean }) => (
                        <div 
                          key={vaccine.name} 
                          className={`text-xs rounded-full px-3 py-1.5 flex items-center justify-center font-medium ${
                            vaccine.available 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {vaccine.available ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {vaccine.name}
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
