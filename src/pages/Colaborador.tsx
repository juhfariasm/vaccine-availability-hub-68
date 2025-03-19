
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  cpf: z.string().min(11, 'CPF inválido').max(14),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

// Para fins de demonstração, estamos usando credenciais fixas
const DEMO_CPF = '12345678900';
const DEMO_SENHA = '123456';

const ColaboradorPage = () => {
  const [form, setForm] = useState<LoginForm>({ cpf: '', senha: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro do campo quando usuário digita
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setForm(prev => ({ ...prev, cpf: formattedCPF }));
    
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(form);
      
      // Verifica as credenciais (em uma aplicação real, isso seria uma chamada API)
      if (form.cpf.replace(/\D/g, '') === DEMO_CPF && form.senha === DEMO_SENHA) {
        setAuthenticated(true);
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao sistema de gerenciamento de vacinas.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "CPF ou senha incorretos.",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<LoginForm> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginForm] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  if (authenticated) {
    return <Navigate to="/gerenciar-vacinas" />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-teal-600">Info</span>Vac
          </h1>
          <p className="mt-2 text-gray-600">Acesso para colaboradores</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={form.cpf}
                  onChange={handleCPFChange}
                  placeholder="Digite seu CPF"
                  className={errors.cpf ? "border-red-500" : ""}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500 mt-1">{errors.cpf}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  className={errors.senha ? "border-red-500" : ""}
                />
                {errors.senha && (
                  <p className="text-sm text-red-500 mt-1">{errors.senha}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Para fins de demonstração, use:
          </p>
          <p className="text-sm text-gray-600">
            CPF: 123.456.789-00, Senha: 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorPage;
