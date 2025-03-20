
import { useEffect } from 'react';
import { useDatabase } from '@/hooks/use-database';
import { useToast } from '@/hooks/use-toast';

const DatabaseInitializer = () => {
  const { isConnected, isLoading } = useDatabase();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isLoading) {
      if (isConnected) {
        console.log('Banco de dados conectado com sucesso!');
      } else {
        console.log('Usando dados mockados para demonstração.');
        toast({
          title: "Modo Demonstração",
          description: "Usando dados para demonstração do frontend.",
          variant: "default"
        });
      }
    }
  }, [isConnected, isLoading, toast]);
  
  // Este componente não renderiza nada visualmente
  return null;
};

export default DatabaseInitializer;
