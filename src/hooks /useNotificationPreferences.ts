
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface NotificationPreferences {
  id?: string;
  general_notifications: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  auto_refresh: boolean;
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    general_notifications: true,
    email_notifications: false,
    push_notifications: true,
    auto_refresh: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching notification preferences:', error);
      } else if (data) {
        setPreferences({
          id: data.id,
          general_notifications: data.general_notifications,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
          auto_refresh: data.auto_refresh,
        });
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return { error: 'User not authenticated' };

    setSaving(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          general_notifications: updatedPreferences.general_notifications,
          email_notifications: updatedPreferences.email_notifications,
          push_notifications: updatedPreferences.push_notifications,
          auto_refresh: updatedPreferences.auto_refresh,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving notification preferences:', error);
        return { error: error.message };
      }

      setPreferences(updatedPreferences);
      return { error: null };
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      return { error: 'Failed to save preferences' };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    saving,
    savePreferences,
    updatePreference: (key: keyof NotificationPreferences, value: boolean) => {
      setPreferences(prev => ({ ...prev, [key]: value }));
    },
  };
};
