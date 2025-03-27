
import React, { ReactNode } from 'react';
import { Cloud } from 'lucide-react';

interface HeavenlyResultsContainerProps {
  children: ReactNode;
}

const HeavenlyResultsContainer = ({ children }: HeavenlyResultsContainerProps) => {
  return (
    <div className="results-container mb-8 relative">
      {/* Decorative clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <Cloud className="floating-cloud cloud-1 text-white/50" />
        <Cloud className="floating-cloud cloud-2 text-white/50" />
        <Cloud className="floating-cloud cloud-3 text-white/50" />
      </div>
      
      {/* Content wrapper */}
      <div className="results-content">
        {children}
      </div>
    </div>
  );
};

export default HeavenlyResultsContainer;
