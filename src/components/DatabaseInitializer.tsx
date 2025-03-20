
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
        console.error('Falha ao conectar ao banco de dados. Usando dados mockados.');
        toast({
          title: "Falha na conexão com o banco",
          description: "Usando dados mockados para demonstração.",
          variant: "destructive"
        });
      }
    }
  }, [isConnected, isLoading, toast]);
  
  // Este componente não renderiza nada visualmente
  return null;
};

export default DatabaseInitializer;
