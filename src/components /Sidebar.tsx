
import { useState } from 'react';
import { TrendingUp, History, Bitcoin, User, Wallet, Menu, X, BarChart3, Settings, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'visao-geral', label: t('dashboard.overview'), icon: BarChart3 },
    { id: 'portfolio', label: t('dashboard.portfolio'), icon: TrendingUp },
    
    { id: 'transacoes', label: t('dashboard.transactions'), icon: History },
    { id: 'cripto', label: t('dashboard.cryptocurrencies'), icon: Bitcoin },
    { id: 'perfil', label: t('dashboard.investorProfile'), icon: User },
    { id: 'carteiras', label: t('dashboard.wallets'), icon: Wallet },
    { id: 'configuracoes', label: t('dashboard.settings'), icon: Settings },
  ];

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-20 left-4 z-50 bg-white shadow-md"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-16 inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full pt-4">
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
