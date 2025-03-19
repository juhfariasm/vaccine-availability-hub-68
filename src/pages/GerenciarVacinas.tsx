
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Check, X, Home } from 'lucide-react';
import { vaccinesList } from '@/data/mockUBSData';
import { Link } from 'react-router-dom';

// Tipos de mensagens para o Typebot
type MessageType = 'bot' | 'user-action' | 'user-confirmation';

// Tipos de ações que o usuário pode realizar
type ActionType = 'select-vaccines' | 'set-availability' | 'confirmation';

// Interface para cada mensagem na conversa
interface Message {
  id: string;
  type: MessageType;
  content: React.ReactNode;
  action?: ActionType;
}

// Interface para controlar a disponibilidade das vacinas
interface VaccineAvailability {
  name: string;
  available: boolean;
}

const GerenciarVacinas = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [vaccineStatus, setVaccineStatus] = useState<VaccineAvailability[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<boolean | null>(null);
  const [conversationCompleted, setConversationCompleted] = useState(false);
  const { toast } = useToast();

  // Inicializar a conversa e as vacinas disponíveis
  useEffect(() => {
    // Inicializar a lista de vacinas com status randômico para demonstração
    const initialVaccineStatus = vaccinesList.map(v => ({
      name: v,
      available: Math.random() > 0.3,
    }));
    setVaccineStatus(initialVaccineStatus);
    
    // Adicionar as mensagens iniciais de boas-vindas
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Olá, colaborador! Bem-vindo ao sistema de gerenciamento de vacinas.',
      },
      {
        id: '2',
        type: 'bot',
        content: 'Como posso ajudar você hoje?',
      },
      {
        id: '3',
        type: 'user-action',
        content: (
          <Button 
            onClick={() => handleStartVaccineSelection()}
            className="flex items-center"
          >
            Alterar disponibilidade de vacinas
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
    ]);
  }, []);

  // Inicia o processo de seleção de vacinas
  const handleStartVaccineSelection = () => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: (
          <div>
            <p>Quais vacinas você deseja alterar a disponibilidade?</p>
            <p className="text-xs mt-1">Selecione uma ou mais opções</p>
          </div>
        ),
      },
      {
        id: Date.now().toString() + '1',
        type: 'user-action',
        action: 'select-vaccines',
        content: (
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
        ),
      },
    ]);
  };

  // Adiciona ou remove uma vacina da lista de selecionadas
  const handleSelectVaccine = (vaccine: string) => {
    setSelectedVaccines(prev => {
      const newSelection = prev.includes(vaccine)
        ? prev.filter(v => v !== vaccine)
        : [...prev, vaccine];
      
      // Atualiza os botões de ação baseado na seleção
      updateActionButton(newSelection);
      return newSelection;
    });
  };

  // Atualiza os botões de ação baseado na seleção de vacinas
  const updateActionButton = (vaccines: string[]) => {
    // Remove qualquer botão de continuar existente
    setMessages(prev => prev.filter(m => m.action !== 'confirmation' && m.id !== 'continue-button'));
    
    // Se há vacinas selecionadas, adiciona o botão de continuar
    if (vaccines.length > 0) {
      setMessages(prev => [
        ...prev,
        {
          id: 'continue-button',
          type: 'user-action',
          content: (
            <Button 
              onClick={() => handleShowAvailabilityOptions()}
              className="self-end flex items-center mt-4"
            >
              Continuar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ),
        },
      ]);
    }
  };

  // Mostra as opções de disponibilidade
  const handleShowAvailabilityOptions = () => {
    setMessages(prev => [
      ...prev.filter(m => m.id !== 'continue-button'), // Remove o botão de continuar
      {
        id: Date.now().toString(),
        type: 'bot',
        content: (
          <div>
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
        ),
      },
      {
        id: Date.now().toString() + '1',
        type: 'user-action',
        action: 'set-availability',
        content: (
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
        ),
      },
    ]);
  };

  // Define a disponibilidade das vacinas selecionadas
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
    
    // Adiciona a mensagem de confirmação
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: (
          <div>
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
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {available ? 'Disponível' : 'Indisponível'}
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        id: Date.now().toString() + '1',
        type: 'user-confirmation',
        content: (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleShowAvailabilityOptions()}
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
        ),
      },
    ]);
  };

  // Confirma as alterações
  const handleConfirm = () => {
    toast({
      title: "Alterações salvas com sucesso",
      description: `${selectedVaccines.length} vacina(s) atualizada(s) com status: ${selectedAvailability ? 'Disponível' : 'Indisponível'}.`,
    });
    
    setConversationCompleted(true);
    
    // Adiciona a mensagem de confirmação
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: (
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-600" />
            <p>Alterações realizadas com sucesso!</p>
          </div>
        ),
      },
      {
        id: Date.now().toString() + '1',
        type: 'user-action',
        content: (
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
        ),
      },
    ]);
  };

  // Reinicia a conversa
  const resetChat = () => {
    setSelectedVaccines([]);
    setSelectedAvailability(null);
    setConversationCompleted(false);
    
    // Reinicia as mensagens
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Olá, colaborador! Bem-vindo ao sistema de gerenciamento de vacinas.',
      },
      {
        id: '2',
        type: 'bot',
        content: 'Como posso ajudar você hoje?',
      },
      {
        id: '3',
        type: 'user-action',
        content: (
          <Button 
            onClick={() => handleStartVaccineSelection()}
            className="flex items-center"
          >
            Alterar disponibilidade de vacinas
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
    ]);
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
            <div className="flex flex-col space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  {message.type === 'bot' && (
                    <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
                      {message.content}
                    </div>
                  )}
                  
                  {(message.type === 'user-action' || message.type === 'user-confirmation') && (
                    <div className={`${message.action ? 'w-full' : ''}`}>
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GerenciarVacinas;
