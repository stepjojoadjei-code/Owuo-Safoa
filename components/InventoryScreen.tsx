import React from 'react';

const InventoryScreen: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center bg-background-dark text-white p-4">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-xl">
          <span className="material-symbols-outlined text-6xl text-primary/50 mb-4">construction</span>
          <h1 className="text-2xl font-bold text-gray-400">Inventory Coming Soon</h1>
          <p className="text-gray-500 max-w-xs mt-2">Our artisans are hard at work forging legendary items for your adventures.</p>
      </div>
    </div>
  );
};

export default InventoryScreen;