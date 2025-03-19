
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Check, X, Home } from 'lucide-react';
import { vaccinesList } from '@/data/mockUBSData';
import { Link } from 'react-router-dom';

// Estados possíveis para o Typebot
type ChatStep = 
  | 'welcome' 
  | 'selectVaccines' 
  | 'setAvailability' 
  | 'confirmation' 
  | 'completed';

// Interface para controlar a disponibilidade das vacinas
interface VaccineAvailability {
  name: string;
  available: boolean;
}

const GerenciarVacinas = () => {
  const [step, setStep] = useState<ChatStep>('welcome');
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [vaccineStatus, setVaccineStatus] = useState<VaccineAvailability[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Inicializar com a lista de vacinas disponíveis
  useEffect(() => {
    const initialVaccineStatus = vaccinesList.map(v => ({
      name: v,
      available: Math.random() > 0.3, // Randomiza o status inicial (apenas para demonstração)
    }));
    setVaccineStatus(initialVaccineStatus);
  }, []);

  const handleSelectVaccine = (vaccine: string) => {
    setSelectedVaccines(prev => {
      if (prev.includes(vaccine)) {
        return prev.filter(v => v !== vaccine);
      } else {
        return [...prev, vaccine];
      }
    });
  };

  const handleSetAvailability = (available: boolean) => {
    setSelectedAvailability(available);
    
    // Atualiza o status das vacinas selecionadas
    const updatedVaccineStatus = [...vaccineStatus];
    selectedVaccines.forEach(vaccine => {
      const index = updatedVaccineStatus.findIndex(v => v.name === vaccine);
      if (index !== -1) {
        updatedVaccineStatus[index] = {
          ...updatedVaccineStatus[index],
          available
        };
      }
    });
    
    setVaccineStatus(updatedVaccineStatus);
    setStep('confirmation');
  };

  const handleConfirm = () => {
    toast({
      title: "Alterações salvas com sucesso",
      description: `${selectedVaccines.length} vacina(s) atualizada(s) com status: ${selectedAvailability ? 'Disponível' : 'Indisponível'}.`,
    });
    setStep('completed');
  };

  const resetChat = () => {
    setSelectedVaccines([]);
    setSelectedAvailability(null);
    setStep('welcome');
  };

  const renderChatStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <div className="flex flex-col space-y-4">
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
              <p>Olá, colaborador! Bem-vindo ao sistema de gerenciamento de vacinas.</p>
            </div>
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
              <p>Como posso ajudar você hoje?</p>
            </div>
            <Button 
              onClick={() => setStep('selectVaccines')}
              className="self-end flex items-center"
            >
              Alterar disponibilidade de vacinas
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      
      case 'selectVaccines':
        return (
          <div className="flex flex-col space-y-4">
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
              <p>Quais vacinas você deseja alterar a disponibilidade?</p>
              <p className="text-xs mt-1">Selecione uma ou mais opções</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vaccineStatus.map(vaccine => (
                <Button
                  key={vaccine.name}
                  variant={selectedVaccines.includes(vaccine.name) ? "default" : "outline"}
                  className={`justify-between ${selectedVaccines.includes(vaccine.name) ? "" : "border-gray-300"}`}
                  onClick={() => handleSelectVaccine(vaccine.name)}
                >
                  <span className="flex items-center">
                    {vaccine.name}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${vaccine.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vaccine.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </span>
                  {selectedVaccines.includes(vaccine.name) && <Check className="h-4 w-4" />}
                </Button>
              ))}
            </div>
            
            {selectedVaccines.length > 0 && (
              <Button 
                onClick={() => setStep('setAvailability')}
                className="self-end flex items-center mt-4"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        );
      
      case 'setAvailability':
        return (
          <div className="flex flex-col space-y-4">
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
              <p>Deseja marcar as vacinas selecionadas como disponíveis ou indisponíveis?</p>
              <div className="mt-2">
                <p className="font-medium">Vacinas selecionadas:</p>
                <ul className="list-disc list-inside">
                  {selectedVaccines.map(vaccine => (
                    <li key={vaccine}>{vaccine}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                onClick={() => handleSetAvailability(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Indisponível
              </Button>
              <Button 
                variant="outline"
                className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                onClick={() => handleSetAvailability(true)}
              >
                <Check className="mr-2 h-4 w-4" />
                Disponível
              </Button>
            </div>
          </div>
        );
      
      case 'confirmation':
        return (
          <div className="flex flex-col space-y-4">
            <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
              <p>Confirme as alterações:</p>
              <div className="mt-2">
                <p className="font-medium">Vacinas:</p>
                <ul className="list-disc list-inside">
                  {selectedVaccines.map(vaccine => (
                    <li key={vaccine}>{vaccine}</li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">
                  Novo status: 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedAvailability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedAvailability ? 'Disponível' : 'Indisponível'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep('selectVaccines')}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleConfirm}
              >
                Confirmar alterações
              </Button>
            </div>
          </div>
        );
      
      case 'completed':
        return (
          <div className="flex flex-col space-y-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <p>Alterações realizadas com sucesso!</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={resetChat}
              >
                Fazer nova alteração
              </Button>
              <Button 
                className="flex-1"
                asChild
              >
                <Link to="/"><Home className="mr-2 h-4 w-4" />Voltar ao início</Link>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-teal-600">Info</span>Vac - Gerenciamento
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
          </Button>
        </div>
        
        <Card className="shadow-lg border-gray-200">
          <CardContent className="p-6">
            {renderChatStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GerenciarVacinas;
