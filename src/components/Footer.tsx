
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-medium">
                <span className="text-teal-600">Vacina</span>Hub
              </h1>
            </div>
            <p className="text-gray-600 mb-5 max-w-md">
              Nosso objetivo é facilitar o acesso à informação sobre disponibilidade de vacinas
              nas UBSs, contribuindo para o aumento da cobertura vacinal e proteção da saúde coletiva.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Links rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-gray-600 hover:text-teal-600 transition-colors">Início</a>
              </li>
              <li>
                <a href="#search" className="text-gray-600 hover:text-teal-600 transition-colors">Pesquisar vacinas</a>
              </li>
              <li>
                <a href="#info" className="text-gray-600 hover:text-teal-600 transition-colors">Mais informações</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">Sobre nós</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">Política de privacidade</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-teal-600" />
                <span>Rua Exemplo, 123 - Cidade</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4 text-teal-600" />
                <a href="mailto:contato@vacinahub.com" className="hover:text-teal-600 transition-colors">
                  contato@vacinahub.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4 text-teal-600" />
                <a href="tel:+551199999999" className="hover:text-teal-600 transition-colors">
                  (11) 9999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} VacinaHub. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Este site não substitui o atendimento médico profissional. Consulte sempre um profissional de saúde.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
