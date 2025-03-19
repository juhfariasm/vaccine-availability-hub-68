
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Check, X, Home, Syringe, Search, Save, CircleAlert, CheckCircle2 } from 'lucide-react';
import { vaccinesList } from '@/data/mockUBSData';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Interface para controlar a disponibilidade das vacinas
interface VaccineAvailability {
  name: string;
  available: boolean;
}

const GerenciarVacinas = () => {
  const [showVaccineManager, setShowVaccineManager] = useState(false);
  const [vaccineStatus, setVaccineStatus] = useState<VaccineAvailability[]>([]);
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changes, setChanges] = useState<VaccineAvailability[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Inicializar as vacinas disponíveis
  useEffect(() => {
    // Inicializar a lista de vacinas com status randômico para demonstração
    const initialVaccineStatus = vaccinesList.map(v => ({
      name: v,
      available: Math.random() > 0.3,
    }));
    
    console.log("Vacinas disponíveis:", vaccinesList);
    console.log("Status inicial das vacinas:", initialVaccineStatus);
    
    setVaccineStatus(initialVaccineStatus);
  }, []);

  const handleVaccineSelect = (vaccine: string) => {
    setSelectedVaccines(prev => 
      prev.includes(vaccine) 
        ? prev.filter(v => v !== vaccine) 
        : [...prev, vaccine]
    );
  };

  const handleStatusChange = (vaccine: string, available: boolean) => {
    // Encontrar o índice da vacina
    const vaccineIndex = changes.findIndex(v => v.name === vaccine);
    
    // Se a vacina já existe nos changes, atualizar seu status
    if (vaccineIndex !== -1) {
      const updatedChanges = [...changes];
      updatedChanges[vaccineIndex].available = available;
      setChanges(updatedChanges);
    } else {
      // Se não, adicionar a nova alteração
      setChanges(prev => [...prev, { name: vaccine, available }]);
    }
  };

  const saveChanges = () => {
    // Atualizar o status das vacinas com as mudanças
    const updatedVaccineStatus = [...vaccineStatus];
    
    changes.forEach(change => {
      const index = updatedVaccineStatus.findIndex(v => v.name === change.name);
      if (index !== -1) {
        updatedVaccineStatus[index] = { ...change };
      }
    });
    
    setVaccineStatus(updatedVaccineStatus);
    setShowConfirmDialog(false);
    setChanges([]);
    // Limpar a seleção de vacinas para que nenhuma apareça em modo de edição
    setSelectedVaccines([]);
    
    toast({
      title: "Alterações salvas com sucesso",
      description: `${changes.length} vacina(s) atualizada(s).`,
    });
  };

  const getVaccineCurrentStatus = (vaccine: string) => {
    // Primeiro verificar se há uma alteração pendente
    const pendingChange = changes.find(v => v.name === vaccine);
    if (pendingChange) return pendingChange.available;
    
    // Se não, retornar o status atual
    const currentStatus = vaccineStatus.find(v => v.name === vaccine);
    return currentStatus ? currentStatus.available : false;
  };

  const isVaccineModified = (vaccine: string) => {
    return changes.some(v => v.name === vaccine);
  };

  // Estatísticas de vacinas
  const getVaccineStats = () => {
    const available = vaccineStatus.filter(v => getVaccineCurrentStatus(v.name)).length;
    const unavailable = vaccineStatus.length - available;
    return { available, unavailable, total: vaccineStatus.length };
  };

  // Filtrar vacinas com base na pesquisa
  const filteredVaccines = vaccineStatus.filter(vaccine => 
    vaccine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
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
            {!showVaccineManager ? (
              <div className="flex flex-col space-y-6">
                <div className="bg-teal-100 text-teal-800 p-4 rounded-lg">
                  <p>Olá, colaborador! Bem-vindo ao sistema de gerenciamento de vacinas.</p>
                  <p className="mt-2">Como posso ajudar você hoje?</p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setShowVaccineManager(true)}
                    className="flex items-center"
                  >
                    <Syringe className="mr-2 h-4 w-4" />
                    Alterar disponibilidade de vacinas
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-400 to-teal-600 text-white p-4 rounded-lg shadow-md">
                  <p className="font-medium">Selecione as vacinas para modificar sua disponibilidade:</p>
                  
                  {/* Contador de estatísticas */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white">
                      Total: {getVaccineStats().total}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Disponíveis: {getVaccineStats().available}
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      <CircleAlert className="h-3 w-3 mr-1" />
                      Indisponíveis: {getVaccineStats().unavailable}
                    </Badge>
                    {changes.length > 0 && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
                        Pendentes: {changes.length}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Barra de pesquisa */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Pesquisar vacina por nome..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                
                <ScrollArea className="h-[320px] rounded-md border p-4">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredVaccines.map((vaccine) => (
                      <Card 
                        key={vaccine.name} 
                        className={`border transition-all duration-200 hover:shadow-md
                          ${isVaccineModified(vaccine.name) 
                            ? 'border-teal-400 bg-teal-50/30' 
                            : 'border-gray-200 hover:border-teal-300'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Button
                                variant={selectedVaccines.includes(vaccine.name) ? "default" : "outline"}
                                size="sm"
                                className={`mr-3 ${selectedVaccines.includes(vaccine.name) ? 'animate-pulse-soft' : ''}`}
                                onClick={() => handleVaccineSelect(vaccine.name)}
                              >
                                {selectedVaccines.includes(vaccine.name) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Syringe className="h-4 w-4" />
                                )}
                              </Button>
                              <div>
                                <p className="font-medium">{vaccine.name}</p>
                                <div className="flex items-center mt-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    getVaccineCurrentStatus(vaccine.name) 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'}`}>
                                    {getVaccineCurrentStatus(vaccine.name) ? 'Disponível' : 'Indisponível'}
                                  </span>
                                  {isVaccineModified(vaccine.name) && (
                                    <span className="ml-2 text-xs text-teal-600 font-medium">
                                      (Alteração pendente)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {selectedVaccines.includes(vaccine.name) && (
                              <div className="flex items-center space-x-3 bg-white p-2 rounded-md shadow-sm">
                                <span className={`text-sm font-medium ${getVaccineCurrentStatus(vaccine.name) ? 'text-green-600' : 'text-red-600'}`}>
                                  {getVaccineCurrentStatus(vaccine.name) ? 'Disponível' : 'Indisponível'}
                                </span>
                                <Switch
                                  checked={getVaccineCurrentStatus(vaccine.name)}
                                  onCheckedChange={(checked) => handleStatusChange(vaccine.name, checked)}
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {filteredVaccines.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                        <Search className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="font-medium">Nenhuma vacina encontrada</p>
                        <p className="text-sm">Tente outro termo de pesquisa</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVaccineManager(false);
                      setSelectedVaccines([]);
                      setChanges([]);
                      setSearchQuery('');
                    }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    disabled={changes.length === 0}
                    onClick={() => setShowConfirmDialog(true)}
                    className={`${changes.length > 0 ? 'animate-pulse-soft' : ''}`}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar alterações ({changes.length})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Save className="h-5 w-5 mr-2 text-teal-600" />
              Confirmar alterações
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4">Confirme as alterações de disponibilidade:</p>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <ul className="space-y-2">
                {changes.map((change) => (
                  <li key={change.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <span className="font-medium">{change.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center
                      ${change.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}
                    >
                      {change.available 
                        ? <><CheckCircle2 className="h-3 w-3 mr-1" />Disponível</>
                        : <><CircleAlert className="h-3 w-3 mr-1" />Indisponível</>
                      }
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Voltar
            </Button>
            <Button onClick={saveChanges} className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarVacinas;
