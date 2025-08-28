
import { useState } from 'react';
import { Settings, Bell, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useAuth } from '@/hooks/useAuth';

const SettingsSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { 
    currency, 
    setCurrency, 
    darkMode, 
    setDarkMode, 
    language, 
    setLanguage 
  } = usePreferences();
  
  const {
    preferences,
    loading: preferencesLoading,
    saving,
    savePreferences,
    updatePreference,
  } = useNotificationPreferences();

  const handleSavePreferences = async () => {
    const result = await savePreferences(preferences);
    if (result.error) {
      alert(`${t('common.error')}: ${result.error}`);
    } else {
      alert(t('settings.savePreferences') + ' - ' + t('common.success'));
    }
  };

  const getLanguageDisplay = (lang: string) => {
    return t(`languages.${lang}`) || t('languages.pt-BR');
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              {t('auth.loginRequired')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Idioma do Site */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {t('settings.siteLanguage')}
          </CardTitle>
          <CardDescription>
            {t('settings.changeLanguageInterface')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.currentLanguage')}</Label>
              <p className="text-sm text-gray-500">
                {getLanguageDisplay(language)}
              </p>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('settings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">{t('languages.pt-BR')}</SelectItem>
                <SelectItem value="en-US">{t('languages.en-US')}</SelectItem>
                <SelectItem value="es-ES">{t('languages.es-ES')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLanguage('pt-BR')}
              className={language === 'pt-BR' ? 'bg-blue-50 border-blue-200' : ''}
            >
              🇧🇷 Português
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLanguage('en-US')}
              className={language === 'en-US' ? 'bg-blue-50 border-blue-200' : ''}
            >
              🇺🇸 English
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLanguage('es-ES')}
              className={language === 'es-ES' ? 'bg-blue-50 border-blue-200' : ''}
            >
              🇪🇸 Español
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('settings.notifications')}
          </CardTitle>
          <CardDescription>
            {t('settings.configureNotifications')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferencesLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">{t('settings.generalNotifications')}</Label>
                  <p className="text-sm text-gray-500">
                    {t('settings.portfolioChanges')}
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferences.general_notifications}
                  onCheckedChange={(checked) => 
                    updatePreference('general_notifications', checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">{t('settings.emailNotifications')}</Label>
                  <p className="text-sm text-gray-500">
                    {t('settings.dailySummary')}
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => 
                    updatePreference('email_notifications', checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">{t('settings.pushNotifications')}</Label>
                  <p className="text-sm text-gray-500">
                    {t('settings.instantAlerts')}
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => 
                    updatePreference('push_notifications', checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRefresh">{t('settings.autoRefresh')}</Label>
                  <p className="text-sm text-gray-500">
                    {t('settings.autoRefreshDescription')}
                  </p>
                </div>
                <Switch
                  id="autoRefresh"
                  checked={preferences.auto_refresh}
                  onCheckedChange={(checked) => 
                    updatePreference('auto_refresh', checked)
                  }
                />
              </div>
              
              <Button 
                onClick={handleSavePreferences} 
                className="w-full md:w-auto"
                disabled={saving}
              >
                {saving ? t('common.saving') : t('settings.savePreferences')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('settings.otherPreferences')}
          </CardTitle>
          <CardDescription>
            {t('settings.customizeAppearance')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.language')}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">{t('languages.pt-BR')}</SelectItem>
                  <SelectItem value="en-US">{t('languages.en-US')}</SelectItem>
                  <SelectItem value="es-ES">{t('languages.es-ES')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">{t('settings.currency')}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder={t('settings.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">{t('currencies.BRL')}</SelectItem>
                  <SelectItem value="USD">{t('currencies.USD')}</SelectItem>
                  <SelectItem value="EUR">{t('currencies.EUR')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">{t('settings.darkMode')}</Label>
              <p className="text-sm text-gray-500">
                {t('settings.enableDarkTheme')}
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('settings.aboutApp')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>{t('settings.version')}:</strong> 1.0.0
          </p>
          <p className="text-sm text-gray-600">
            <strong>{t('settings.lastUpdate')}:</strong> 28 de Maio, 2025
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm">
              {t('settings.checkUpdates')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
