
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import { UBSItem } from '@/types/ubs';

interface UBSCardProps {
  ubs: UBSItem;
}

const UBSCard = ({ ubs }: UBSCardProps) => {
  return (
    <Card className="carousel-card glass-card border-gray-100 transition-all duration-300 hover:shadow-md animate-fade-in flex-1 min-w-0 max-w-full md:max-w-[calc(33.333%-1rem)]">
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
  );
};

export default UBSCard;
