import React from 'react';

const Section: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <section className="p-8">
      {children || <p>Section Placeholder</p>}
    </section>
  );
};

export default Section;
