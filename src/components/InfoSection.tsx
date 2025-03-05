
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  ShieldCheck, 
  HelpCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const InfoSection = () => {
  const [activeTab, setActiveTab] = useState('faq');
  
  return (
    <section id="info" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 mb-4 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
            Informações úteis
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Mais sobre vacinas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consulte informações importantes sobre calendário de vacinação e tire suas dúvidas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
          <div className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible py-2 lg:py-0">
            <Card 
              className={`flex-shrink-0 cursor-pointer transition-all ${activeTab === 'faq' ? 
                'bg-teal-600 text-white shadow-md' : 
                'bg-white hover:bg-gray-50'}`}
              onClick={() => setActiveTab('faq')}
            >
              <CardContent className="flex items-center p-4 gap-3">
                <HelpCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Perguntas frequentes</h3>
                  <p className={`text-sm ${activeTab === 'faq' ? 'text-white/80' : 'text-gray-500'}`}>
                    Tire suas dúvidas
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </CardContent>
            </Card>
            
            <Card 
              className={`flex-shrink-0 cursor-pointer transition-all ${activeTab === 'calendar' ? 
                'bg-teal-600 text-white shadow-md' : 
                'bg-white hover:bg-gray-50'}`}
              onClick={() => setActiveTab('calendar')}
            >
              <CardContent className="flex items-center p-4 gap-3">
                <Calendar className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Calendário de vacinação</h3>
                  <p className={`text-sm ${activeTab === 'calendar' ? 'text-white/80' : 'text-gray-500'}`}>
                    Por idade e grupos
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </CardContent>
            </Card>
            
            <Card 
              className={`flex-shrink-0 cursor-pointer transition-all ${activeTab === 'groups' ? 
                'bg-teal-600 text-white shadow-md' : 
                'bg-white hover:bg-gray-50'}`}
              onClick={() => setActiveTab('groups')}
            >
              <CardContent className="flex items-center p-4 gap-3">
                <Users className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Grupos prioritários</h3>
                  <p className={`text-sm ${activeTab === 'groups' ? 'text-white/80' : 'text-gray-500'}`}>
                    Quem tem prioridade
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </CardContent>
            </Card>
            
            <Card 
              className={`flex-shrink-0 cursor-pointer transition-all ${activeTab === 'importance' ? 
                'bg-teal-600 text-white shadow-md' : 
                'bg-white hover:bg-gray-50'}`}
              onClick={() => setActiveTab('importance')}
            >
              <CardContent className="flex items-center p-4 gap-3">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Importância da vacinação</h3>
                  <p className={`text-sm ${activeTab === 'importance' ? 'text-white/80' : 'text-gray-500'}`}>
                    Por que vacinar
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </CardContent>
            </Card>
            
            <Card 
              className={`flex-shrink-0 cursor-pointer transition-all ${activeTab === 'side-effects' ? 
                'bg-teal-600 text-white shadow-md' : 
                'bg-white hover:bg-gray-50'}`}
              onClick={() => setActiveTab('side-effects')}
            >
              <CardContent className="flex items-center p-4 gap-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">Efeitos colaterais</h3>
                  <p className={`text-sm ${activeTab === 'side-effects' ? 'text-white/80' : 'text-gray-500'}`}>
                    O que esperar
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </CardContent>
            </Card>
          </div>
          
          <div className="glass-card p-6 md:p-8 bg-white rounded-xl shadow-sm min-h-[500px]">
            {activeTab === 'faq' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-medium mb-6">Perguntas frequentes</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      Como sei quais vacinas estão disponíveis na UBS mais próxima?
                    </AccordionTrigger>
                    <AccordionContent>
                      Você pode usar a função "Usar minha localização" na página inicial ou buscar pela UBS desejada
                      na seção de pesquisa. O sistema mostrará quais vacinas estão disponíveis em cada unidade.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Preciso agendar para tomar vacina?
                    </AccordionTrigger>
                    <AccordionContent>
                      Geralmente não é necessário agendamento para vacinas de rotina, mas algumas campanhas 
                      específicas podem requerer agendamento prévio. Recomendamos verificar junto à UBS escolhida.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      Quais documentos preciso levar para me vacinar?
                    </AccordionTrigger>
                    <AccordionContent>
                      É necessário levar um documento de identificação com foto, cartão SUS (se tiver) e a 
                      caderneta de vacinação. Para crianças, é importante levar a caderneta de vacinação infantil.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Com que frequência os dados de disponibilidade são atualizados?
                    </AccordionTrigger>
                    <AccordionContent>
                      Os dados são atualizados em tempo real conforme as UBSs informam a disponibilidade
                      de seus estoques através de um sistema integrado.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      O que fazer se a vacina que preciso não estiver disponível?
                    </AccordionTrigger>
                    <AccordionContent>
                      Você pode verificar em outras UBSs próximas usando nossa função de busca. Também é 
                      possível entrar em contato diretamente com a UBS para saber quando a vacina estará 
                      disponível novamente.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left">
                      Posso tomar mais de uma vacina no mesmo dia?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sim, na maioria dos casos é possível tomar múltiplas vacinas no mesmo dia. Os profissionais 
                      de saúde na UBS poderão orientar sobre quais vacinas podem ser administradas simultaneamente.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {activeTab === 'calendar' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-medium mb-6">Calendário Nacional de Vacinação</h3>
                
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-3 text-teal-700">Crianças (0 a 10 anos)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">Ao nascer:</span> BCG, Hepatite B
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">2 meses:</span> Pentavalente, VIP, Pneumocócica 10, Rotavírus
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">4 meses:</span> Pentavalente, VIP, Pneumocócica 10, Rotavírus
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">6 meses:</span> Pentavalente, VIP, Influenza
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">9 meses:</span> Febre Amarela
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">12 meses:</span> Tríplice Viral, Pneumocócica 10, Meningocócica C
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">15 meses:</span> DTP, VOP, Hepatite A, Tríplice Viral
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3 text-teal-700">Adolescentes (11 a 19 anos)</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
                      <div>
                        <span className="font-medium">11 a 14 anos:</span> HPV (2 doses), Meningocócica C, dT, Febre Amarela, Hepatite B, Tríplice Viral
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'groups' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-medium mb-6">Grupos prioritários para vacinação</h3>
                
                <p className="text-gray-700 mb-6">
                  Em certas campanhas de vacinação, alguns grupos têm prioridade devido ao maior risco de complicações
                  ou pela importância estratégica para a saúde pública.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-medium mb-3 text-teal-700">Campanha de Influenza</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Crianças de 6 meses a 5 anos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Gestantes e puérperas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Idosos (acima de 60 anos)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Profissionais de saúde</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Pessoas com doenças crônicas</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50 border-0">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-medium mb-3 text-teal-700">Campanha de COVID-19</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Profissionais de saúde</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Idosos acima de 60 anos</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Pessoas com comorbidades</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Pessoas com deficiência permanente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-teal-100 text-teal-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✓</span>
                          <span>Gestantes e puérperas</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeTab === 'importance' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-medium mb-6">Importância da vacinação</h3>
                
                <p className="text-gray-700 mb-6">
                  A vacinação é uma das formas mais eficazes de prevenção contra doenças infecciosas,
                  tanto para a proteção individual quanto para a saúde pública coletiva.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-teal-50 p-6 rounded-xl">
                    <h4 className="text-lg font-medium mb-3 text-teal-700">Proteção individual</h4>
                    <p className="text-gray-700">
                      As vacinas estimulam o sistema imunológico a produzir anticorpos contra patógenos específicos,
                      preparando o corpo para combater infecções futuras de forma eficaz e reduzindo o risco de
                      complicações graves.
                    </p>
                  </div>
                  
                  <div className="bg-teal-50 p-6 rounded-xl">
                    <h4 className="text-lg font-medium mb-3 text-teal-700">Proteção coletiva</h4>
                    <p className="text-gray-700">
                      Quando grande parte da população está vacinada, cria-se a "imunidade de rebanho", que dificulta
                      a propagação de doenças e protege indiretamente até mesmo quem não pode ser vacinado por
                      motivos médicos.
                    </p>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium mb-4 text-teal-700">Conquistas da vacinação</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Erradicação da varíola</span>: A varíola, uma doença devastadora que matou milhões
                      de pessoas ao longo da história, foi oficialmente erradicada em 1980 graças à vacinação global.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Controle da poliomielite</span>: O Brasil está livre da poliomielite desde 1989,
                      e os casos globais diminuíram 99,9% desde 1988.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Redução de mortalidade infantil</span>: A vacinação previne cerca de 2 a 3 milhões
                      de mortes por ano em todo o mundo, muitas delas de crianças menores de 5 anos.
                    </div>
                  </li>
                </ul>
              </div>
            )}
            
            {activeTab === 'side-effects' && (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-medium mb-6">Efeitos colaterais</h3>
                
                <p className="text-gray-700 mb-6">
                  A maioria das vacinas pode causar efeitos colaterais leves e temporários, que são indicativos
                  de que o corpo está desenvolvendo proteção. Efeitos colaterais graves são extremamente raros.
                </p>
                
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-3 text-teal-700">Efeitos comuns</h4>
                  <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <h5 className="font-medium">Dor ou inchaço no local da injeção</h5>
                        <p className="text-gray-600 text-sm">
                          Pode-se aplicar uma compressa fria no local para aliviar o desconforto.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <div>
                        <h5 className="font-medium">Febre baixa</h5>
                        <p className="text-gray-600 text-sm">
                          É uma resposta normal do sistema imunológico. Paracetamol pode ser usado conforme orientação médica.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <div>
                        <h5 className="font-medium">Fadiga e mal-estar</h5>
                        <p className="text-gray-600 text-sm">
                          Geralmente desaparece em 1-2 dias. Descanso é recomendado.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <h5 className="font-medium">Dor de cabeça</h5>
                        <p className="text-gray-600 text-sm">
                          Comum após algumas vacinas. Medicamentos como paracetamol podem ajudar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 border border-yellow-200 bg-yellow-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-medium mb-1 text-yellow-800">Quando procurar ajuda médica</h4>
                      <p className="text-yellow-700 mb-3">
                        Embora raros, alguns sintomas precisam de atenção médica imediata:
                      </p>
                      <ul className="space-y-2 text-yellow-700">
                        <li className="flex items-start gap-2">
                          <span className="bg-yellow-100 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">!</span>
                          <span>Febre alta (acima de 39,5°C)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-yellow-100 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">!</span>
                          <span>Reações alérgicas: dificuldade para respirar, urticária, inchaço do rosto</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="bg-yellow-100 text-yellow-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">!</span>
                          <span>Convulsões ou alterações neurológicas</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
