
import { useState, useEffect } from 'react';
import ResultsDisplay from './ResultsDisplay';
import MethodologySection from './MethodologySection';
import PopulationChart from './PopulationChart';
import ShareButton from './ShareButton';
import { CalculationResult } from '@/utils/calculationLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ResultsScreenProps {
  results: CalculationResult;
  onTryAgain: () => void;
}

const ResultsScreen = ({ results, onTryAgain }: ResultsScreenProps) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set a timeout to complete the animation after 3 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-grow py-12 md:py-20 px-4 md:px-6 relative">
      {/* Cloud reveal animation */}
      <div className={`cloud-reveal-animation ${animationComplete ? 'complete' : ''}`}>
        <div className="cloud-left"></div>
        <div className="cloud-right"></div>
      </div>

      {/* Results content */}
      <div className={`w-full max-w-4xl mx-auto space-y-10 transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
        <ResultsDisplay results={results} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Population Chart - V1 Feature */}
          <div className="col-span-2">
            <PopulationChart 
              humanSouls={results.humanSouls} 
              dogSouls={results.dogSouls} 
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-4 flex-wrap pt-6">
          <Button 
            onClick={onTryAgain} 
            className="px-8 py-6 text-lg font-medium rounded-full shadow-elevated bg-primary text-white hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Try Again</span>
          </Button>
          
          {/* Share Button - V1 Feature */}
          <ShareButton results={results} />
        </div>
        
        {/* Methodology section moved to results page */}
        <MethodologySection
          results={results}
          selectedDoctrine={results.doctrine!}
          allDogsGoToHeaven={results.allDogsGoToHeaven!}
          dogGoodnessPercentage={results.dogGoodnessPercentage!}
        />
      </div>
    </div>
  );
};

export default ResultsScreen;
