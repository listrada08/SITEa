import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

const Auth = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to dashboard
        if (session?.user) {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Login realizado com sucesso!');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Este email já está registrado.');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess('Conta criada com sucesso! Verifique seu email para ativar a conta.');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already authenticated, redirect them
  if (user) {
    return null;
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/lovable-uploads/6f521fe1-4c2e-4ce8-b622-50a9bacf6215.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl" style={{ backgroundColor: '#a8e6cf' }}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-gray-900">Moey Tracker</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2" style={{ backgroundColor: '#ff6400' }}>
              <TabsTrigger value="login" className="text-white data-[state=active]:text-black data-[state=active]:bg-white">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:text-black data-[state=active]:bg-white">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-black">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Digite seu email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    style={{ backgroundColor: '#ff6400', color: 'white' }}
                    className="placeholder:text-white/70 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-black">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    style={{ backgroundColor: '#ff6400', color: 'white' }}
                    className="placeholder:text-white/70 border-none"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Button 
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm text-black"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full text-black border-none" 
                  disabled={loading}
                  style={{ backgroundColor: 'white' }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-black">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ backgroundColor: '#ff6400', color: 'white' }}
                    className="placeholder:text-white/70 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-black">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Digite seu email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    style={{ backgroundColor: '#ff6400', color: 'white' }}
                    className="placeholder:text-white/70 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-black">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Escolha uma senha"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ backgroundColor: '#ff6400', color: 'white' }}
                    className="placeholder:text-white/70 border-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full text-black border-none" 
                  disabled={loading}
                  style={{ backgroundColor: 'white' }}
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <AlertDescription className="text-green-800 dark:text-green-200">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
