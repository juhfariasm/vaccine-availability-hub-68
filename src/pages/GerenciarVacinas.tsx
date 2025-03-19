
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  Check, 
  X, 
  Home, 
  Syringe, 
  Search, 
  Save, 
  CircleAlert, 
  CheckCircle2,
  ClipboardList,
  Clock,
  CalendarClock,
  Filter,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { vaccinesList } from '@/data/mockUBSData';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface para controlar a disponibilidade das vacinas
interface VaccineAvailability {
  name: string;
  available: boolean;
  lastUpdated?: string;
}

// Interface para registrar alterações
interface ChangeHistory {
  vaccine: string;
  date: string;
  changedTo: boolean;
}

const GerenciarVacinas = () => {
  const [showVaccineManager, setShowVaccineManager] = useState(false);
  const [vaccineStatus, setVaccineStatus] = useState<VaccineAvailability[]>([]);
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changes, setChanges] = useState<VaccineAvailability[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [changeHistory, setChangeHistory] = useState<ChangeHistory[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'available' | 'unavailable'>('all');
  const [currentVaccine, setCurrentVaccine] = useState<string | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const { toast } = useToast();

  // Inicializar as vacinas disponíveis
  useEffect(() => {
    // Inicializar a lista de vacinas com status randômico para demonstração
    const initialVaccineStatus = vaccinesList.map(v => ({
      name: v,
      available: Math.random() > 0.3,
      lastUpdated: new Date().toISOString()
    }));
    
    console.log("Vacinas disponíveis:", vaccinesList);
    console.log("Status inicial das vacinas:", initialVaccineStatus);
    
    setVaccineStatus(initialVaccineStatus);
    
    // Criar histórico inicial fictício
    const mockHistory: ChangeHistory[] = [];
    for (let i = 0; i < 10; i++) {
      const randomVaccine = vaccinesList[Math.floor(Math.random() * vaccinesList.length)];
      const randomAvailable = Math.random() > 0.5;
      const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      
      mockHistory.push({
        vaccine: randomVaccine,
        date: randomDate,
        changedTo: randomAvailable
      });
    }
    
    setChangeHistory(mockHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
      setChanges(prev => [...prev, { 
        name: vaccine, 
        available, 
        lastUpdated: new Date().toISOString()
      }]);
    }
  };

  const saveChanges = () => {
    // Atualizar o status das vacinas com as mudanças
    const updatedVaccineStatus = [...vaccineStatus];
    const newHistoryEntries: ChangeHistory[] = [];
    
    changes.forEach(change => {
      const index = updatedVaccineStatus.findIndex(v => v.name === change.name);
      if (index !== -1) {
        updatedVaccineStatus[index] = { ...change };
        
        // Adicionar ao histórico
        newHistoryEntries.push({
          vaccine: change.name,
          date: new Date().toISOString(),
          changedTo: change.available
        });
      }
    });
    
    setVaccineStatus(updatedVaccineStatus);
    setShowConfirmDialog(false);
    setChanges([]);
    // Limpar a seleção de vacinas para que nenhuma apareça em modo de edição
    setSelectedVaccines([]);
    
    // Atualizar o histórico
    setChangeHistory(prev => [...newHistoryEntries, ...prev]);
    
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
    const pendingChanges = changes.length;
    return { available, unavailable, total: vaccineStatus.length, pendingChanges };
  };

  // Recuperar o histórico específico de uma vacina
  const getVaccineHistory = (vaccine: string) => {
    return changeHistory
      .filter(h => h.vaccine === vaccine)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filtrar vacinas com base na pesquisa e no filtro selecionado
  const filteredVaccines = vaccineStatus.filter(vaccine => {
    const matchesSearch = vaccine.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'available') return matchesSearch && getVaccineCurrentStatus(vaccine.name);
    if (filterType === 'unavailable') return matchesSearch && !getVaccineCurrentStatus(vaccine.name);
    return matchesSearch;
  });

  // Gerar estatísticas para o gráfico
  const generateStatsData = () => {
    // Agrupar por dia as mudanças
    const last7Days = Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    const dailyCounts = last7Days.map(day => {
      const dayChanges = changeHistory.filter(ch => 
        ch.date.split('T')[0] === day
      );
      
      return {
        date: day,
        count: dayChanges.length,
        available: dayChanges.filter(ch => ch.changedTo).length,
        unavailable: dayChanges.filter(ch => !ch.changedTo).length
      };
    });
    
    return dailyCounts;
  };

  const statsData = generateStatsData();

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
            className="border-teal-200 hover:bg-teal-50 hover:text-teal-700"
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
                <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 text-teal-800 p-6 rounded-lg shadow-sm border border-teal-100">
                  <h2 className="text-xl font-medium mb-2 text-teal-700">Olá, colaborador!</h2>
                  <p className="text-teal-600">Bem-vindo ao sistema de gerenciamento de vacinas.</p>
                  <p className="mt-2 text-teal-600">Como posso ajudar você hoje?</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => setShowVaccineManager(true)}
                    variant="gradient"
                    className="flex-1 py-6"
                  >
                    <Syringe className="mr-2 h-5 w-5" />
                    Alterar disponibilidade de vacinas
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={() => setShowHistoryDialog(true)}
                    variant="outline"
                    className="flex-1 py-6 border-teal-200 hover:bg-teal-50"
                  >
                    <ClipboardList className="mr-2 h-5 w-5 text-teal-600" />
                    Ver histórico de alterações
                  </Button>
                  
                  <Button 
                    onClick={() => setShowStatsDialog(true)}
                    variant="outline"
                    className="flex-1 py-6 border-teal-200 hover:bg-teal-50"
                  >
                    <BarChart3 className="mr-2 h-5 w-5 text-teal-600" />
                    Estatísticas
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg shadow-md">
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
                
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Barra de pesquisa */}
                  <div className="relative flex-1">
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
                  
                  {/* Botão de filtro */}
                  <Button
                    variant="outline"
                    className="border-teal-200 hover:bg-teal-50"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    <Filter className={`h-4 w-4 ${filtersOpen ? 'text-teal-600' : 'text-gray-500'}`} />
                    Filtrar
                    {filterType !== 'all' && (
                      <Badge variant="outline" className="ml-2 bg-teal-50 text-teal-700">
                        {filterType === 'available' ? 'Disponíveis' : 'Indisponíveis'}
                      </Badge>
                    )}
                  </Button>
                </div>
                
                {/* Filtros */}
                {filtersOpen && (
                  <div className="bg-teal-50 p-4 rounded-md border border-teal-100 flex gap-2">
                    <Button
                      variant={filterType === 'all' ? "gradient" : "outline"}
                      size="sm"
                      onClick={() => setFilterType('all')}
                      className={filterType !== 'all' ? "border-teal-200" : ""}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={filterType === 'available' ? "gradient" : "outline"}
                      size="sm"
                      onClick={() => setFilterType('available')}
                      className={filterType !== 'available' ? "border-teal-200" : ""}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Disponíveis
                    </Button>
                    <Button
                      variant={filterType === 'unavailable' ? "gradient" : "outline"}
                      size="sm"
                      onClick={() => setFilterType('unavailable')}
                      className={filterType !== 'unavailable' ? "border-teal-200" : ""}
                    >
                      <CircleAlert className="h-3 w-3 mr-1" />
                      Indisponíveis
                    </Button>
                  </div>
                )}
                
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
                                variant={selectedVaccines.includes(vaccine.name) ? "gradient" : "outline"}
                                size="sm"
                                className={`mr-3 ${
                                  selectedVaccines.includes(vaccine.name)
                                    ? 'animate-pulse-soft'
                                    : 'border-teal-200 hover:bg-teal-50'
                                }`}
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
                            
                            <div className="flex items-center gap-2">
                              {vaccine.lastUpdated && (
                                <span className="text-xs text-gray-500 hidden sm:inline-flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Atualizado: {formatDate(vaccine.lastUpdated)}
                                </span>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-teal-200 hover:bg-teal-50"
                                onClick={() => {
                                  setCurrentVaccine(vaccine.name);
                                  setShowHistoryDialog(true);
                                }}
                              >
                                <ClipboardList className="h-3 w-3" />
                              </Button>
                              
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
                    className="border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                    onClick={() => {
                      setShowVaccineManager(false);
                      setSelectedVaccines([]);
                      setChanges([]);
                      setSearchQuery('');
                      setFilterType('all');
                      setFiltersOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    disabled={changes.length === 0}
                    onClick={() => setShowConfirmDialog(true)}
                    variant="gradient"
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
      
      {/* Diálogo de Confirmação */}
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
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              className="border-teal-200 hover:bg-teal-50"
            >
              Voltar
            </Button>
            <Button 
              onClick={saveChanges} 
              variant="gradient"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Histórico */}
      <Dialog open={showHistoryDialog} onOpenChange={(open) => {
        setShowHistoryDialog(open);
        if (!open) setCurrentVaccine(null);
      }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-teal-600" />
              {currentVaccine ? `Histórico da Vacina: ${currentVaccine}` : 'Histórico de Alterações'}
            </DialogTitle>
          </DialogHeader>
          
          {currentVaccine ? (
            // Histórico específico de uma vacina
            <div className="py-4">
              <div className="mb-4 p-3 bg-teal-50 rounded-md border border-teal-100">
                <h3 className="font-medium text-teal-800 mb-1">Vacina: {currentVaccine}</h3>
                <p className="text-sm text-teal-600">Histórico de alterações de disponibilidade</p>
              </div>
              
              {getVaccineHistory(currentVaccine).length > 0 ? (
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-3">
                    {getVaccineHistory(currentVaccine).map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 text-teal-500 mr-2" />
                          <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center
                          ${entry.changedTo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}
                        >
                          {entry.changedTo 
                            ? <><CheckCircle2 className="h-3 w-3 mr-1" />Disponível</>
                            : <><CircleAlert className="h-3 w-3 mr-1" />Indisponível</>
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="font-medium">Nenhum histórico encontrado</p>
                  <p className="text-sm">Esta vacina não possui alterações recentes</p>
                </div>
              )}
            </div>
          ) : (
            // Histórico global de todas as vacinas
            <div className="py-4">
              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-3">
                  {changeHistory.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{entry.vaccine}</p>
                        <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center
                        ${entry.changedTo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'}`}
                      >
                        {entry.changedTo 
                          ? <><CheckCircle2 className="h-3 w-3 mr-1" />Disponível</>
                          : <><CircleAlert className="h-3 w-3 mr-1" />Indisponível</>
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowHistoryDialog(false);
                setCurrentVaccine(null);
              }}
              className="border-teal-200 hover:bg-teal-50"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Estatísticas */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
              Estatísticas de Vacinas
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="history">Histórico (7 dias)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-3xl font-bold text-teal-600">{getVaccineStats().total}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Disponíveis</p>
                        <p className="text-3xl font-bold text-green-600">{getVaccineStats().available}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Indisponíveis</p>
                        <p className="text-3xl font-bold text-red-600">{getVaccineStats().unavailable}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Alterações</p>
                        <p className="text-3xl font-bold text-blue-600">{changeHistory.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardContent className="pt-6">
                    <p className="font-medium mb-4">Disponibilidade atual</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(getVaccineStats().available / getVaccineStats().total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {Math.round((getVaccineStats().available / getVaccineStats().total) * 100)}% disponíveis
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardContent className="pt-6">
                    <p className="font-medium mb-4">Alterações por dia (últimos 7 dias)</p>
                    <div className="h-[200px] w-full">
                      <div className="flex flex-col space-y-2">
                        {statsData.map((day) => (
                          <div key={day.date} className="flex items-center space-x-2">
                            <span className="text-xs w-24 text-gray-500">
                              {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                            <div className="flex-1 h-8 flex items-center">
                              {day.count > 0 ? (
                                <>
                                  <div 
                                    className="h-8 bg-green-500 rounded-l-md"
                                    style={{ width: `${(day.available / Math.max(...statsData.map(d => d.count))) * 100}%` }}
                                  ></div>
                                  <div 
                                    className="h-8 bg-red-500 rounded-r-md"
                                    style={{ width: `${(day.unavailable / Math.max(...statsData.map(d => d.count))) * 100}%` }}
                                  ></div>
                                </>
                              ) : (
                                <div className="h-8 w-full bg-gray-200 rounded-md flex items-center justify-center">
                                  <span className="text-xs text-gray-500">Sem alterações</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs w-16 text-center">{day.count} {day.count === 1 ? 'alteração' : 'alterações'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4 space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-xs">Disponibilizadas</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-xs">Indisponibilizadas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowStatsDialog(false)}
              className="border-teal-200 hover:bg-teal-50"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarVacinas;
