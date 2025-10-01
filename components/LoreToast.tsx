import React, { useEffect, useState } from 'react';
import { ToastData } from '../types';

interface LoreToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const toastIcons = {
    lore: 'menu_book',
    quest: 'military_tech',
    error: 'error'
};
const toastColors = {
    lore: 'bg-primary/80 border-primary',
    quest: 'bg-green-600/80 border-green-500',
    error: 'bg-red-600/80 border-red-500'
};

const LoreToast: React.FC<LoreToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(toast.id), 300); // Wait for fade out
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    return (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 rounded-lg border-2 backdrop-blur-sm shadow-lg z-50
            ${toastColors[toast.type]}
            ${isVisible ? 'animate-fadeIn' : 'animate-fadeOut'}`
        }>
            <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-white">{toastIcons[toast.type]}</span>
                <p className="font-bold text-white">{toast.content}</p>
            </div>
        </div>
    );
};

export default LoreToast;
