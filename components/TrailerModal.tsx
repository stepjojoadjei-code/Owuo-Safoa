import React from 'react';

const TrailerModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg" onClick={e => e.stopPropagation()}>
        <p>Trailer Modal Placeholder</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TrailerModal;
