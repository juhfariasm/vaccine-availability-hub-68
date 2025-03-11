
import { Search } from 'lucide-react';

const EmptyResults = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
      <p className="text-gray-600">
        Tente ajustar seus filtros ou buscar por outro termo.
      </p>
    </div>
  );
};

export default EmptyResults;
