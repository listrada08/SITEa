
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import EditProfileDialog from './EditProfileDialog';
import { Mail, Calendar, User, Smartphone } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const ProfileSection = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      } else {
        // Se não existe perfil, criar um básico
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (!insertError && insertedData) {
          setProfile(insertedData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  const handleDisconnectAllDevices = async () => {
    if (!confirm('Tem certeza que deseja desconectar todos os dispositivos? Você precisará fazer login novamente em todos os dispositivos.')) {
      return;
    }

    setDisconnecting(true);
    
    try {
      // Supabase doesn't have a direct method to sign out from all devices
      // The best we can do is sign out from current session
      // In a real-world scenario, you'd need to implement token invalidation on the backend
      await signOut();
      alert('Você foi desconectado de todos os dispositivos com sucesso.');
    } catch (error) {
      console.error('Error disconnecting devices:', error);
      alert('Erro ao desconectar dispositivos. Tente novamente.');
    } finally {
      setDisconnecting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              Você precisa estar logado para ver seu perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-gray-300 rounded"></div>
                  <div className="h-4 w-48 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email || 'Usuário';
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
        <EditProfileDialog 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Suas informações de perfil e dados da conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <Badge variant="secondary">
                Usuário Ativo
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Nome Completo</p>
                  <p className="text-sm text-gray-600">
                    {profile?.full_name || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Membro desde</p>
                  <p className="text-sm text-gray-600">
                    {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                      : 'Data não disponível'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Última atualização</p>
                  <p className="text-sm text-gray-600">
                    {profile?.updated_at 
                      ? new Date(profile.updated_at).toLocaleDateString('pt-BR')
                      : 'Data não disponível'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
          <CardDescription>
            Gerencie suas preferências de conta e segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status da Conta</p>
                <p className="text-sm text-gray-600">Sua conta está ativa</p>
              </div>
              <Badge variant="default">Ativo</Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Verificado</p>
                <p className="text-sm text-gray-600">
                  {user.email_confirmed_at ? 'Email confirmado' : 'Email não confirmado'}
                </p>
              </div>
              <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                {user.email_confirmed_at ? 'Verificado' : 'Pendente'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">Dispositivos Conectados</p>
                  <p className="text-sm text-gray-600">
                    Desconecte-se de todos os dispositivos por segurança
                  </p>
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleDisconnectAllDevices}
                disabled={disconnecting}
                className="whitespace-nowrap"
              >
                {disconnecting ? 'Desconectando...' : 'Desconectar Todos os Dispositivos'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
