
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import EditProfileDialog from './EditProfileDialog';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (!insertError) {
          setProfile(newProfile);
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

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileUpdate = () => {
    fetchProfile();
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.email || 'Usuário';
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-sm font-medium truncate">
          {displayName}
        </span>
        <span className="text-xs text-gray-500 truncate">
          {user.email}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <EditProfileDialog 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate}
        />
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          size="sm"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
