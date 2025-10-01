import React, { useState } from 'react';
import { MainHubTab } from '../types';
import QuestMapScreen from './QuestMapScreen';
import HomeScreen from './HomeScreen';
import InventoryScreen from './InventoryScreen';
import SettingsScreen from './SettingsScreen';
import LoreJournalModal from './LoreJournalModal'; // Re-using this as the Lore screen

const MainGameUI: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MainHubTab>('quest');
    const [isLoreOpen, setIsLoreOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeScreen />;
            case 'quest':
                return <QuestMapScreen />;
            case 'inventory':
                return <InventoryScreen />;
            case 'settings':
                return <SettingsScreen />;
            default:
                return <QuestMapScreen />;
        }
    };
    
    const handleNavClick = (tab: MainHubTab) => {
        if (tab === 'lore') {
            setIsLoreOpen(true);
        } else {
            setActiveTab(tab);
        }
    };

    const navItems: { id: MainHubTab; label: string; icon: string }[] = [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'lore', label: 'Lore', icon: 'menu_book' },
        { id: 'quest', label: 'Quest', icon: 'map' },
        { id: 'inventory', label: 'Inventory', icon: 'shield' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
    ];

    return (
        <div className="flex h-screen w-screen flex-col bg-background-dark">
            <div className="flex-grow overflow-hidden">
                {renderContent()}
            </div>

            {isLoreOpen && <LoreJournalModal onClose={() => setIsLoreOpen(false)} />}
            
            <footer className="sticky bottom-0 bg-background-dark/80 backdrop-blur-sm border-t border-primary/20 pt-2 pb-4">
                <nav className="flex justify-around items-end">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => handleNavClick(item.id)} className={`flex flex-col items-center justify-end gap-1 transition-colors hover:text-primary ${activeTab === item.id && item.id !== 'lore' ? 'text-primary' : 'text-gray-400'}`}>
                            {item.id === 'quest' ? (
                                <>
                                 <div className="bg-primary p-4 rounded-full -translate-y-6 shadow-lg shadow-primary/30">
                                    <span className="material-symbols-outlined text-white !text-3xl">{item.icon}</span>
                                </div>
                                <p className="text-xs font-medium -translate-y-3">{item.label}</p>
                                </>
                            ) : (
                                <>
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                <p className="text-xs font-medium">{item.label}</p>
                                </>
                            )}
                        </button>
                    ))}
                </nav>
            </footer>
        </div>
    );
};

export default MainGameUI;
