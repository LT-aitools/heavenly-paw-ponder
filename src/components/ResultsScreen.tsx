import { useState, useEffect } from 'react';
import ResultsDisplay from './ResultsDisplay';
import MethodologySection from './MethodologySection';
import { ShareButton } from './ShareButton';
import { CalculationResult } from '@/utils/calculationLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import HeavenlyResultsContainer from './HeavenlyResultsContainer';

interface ResultsScreenProps {
  results: CalculationResult;
  onTryAgain: () => void;
}

const ResultsScreen = ({ results, onTryAgain }: ResultsScreenProps) => {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showCloudAnimation, setShowCloudAnimation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger cloud reveal animation
    const timer = setTimeout(() => {
      setShowCloudAnimation(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only show results when we have valid data
    if (results && results.humanSouls > 0) {
      setIsLoading(false);
    }
  }, [results]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center text-heaven-blue">Loading your heavenly census...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative">
        {/* Add clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="cloud opacity-50 cloud-1" style={{ top: '15%', left: '8%', transform: 'scale(0.9)' }}></div>
          <div className="cloud opacity-50 cloud-2" style={{ top: '35%', right: '12%', transform: 'scale(1.1)' }}></div>
          <div className="cloud opacity-50 cloud-3" style={{ top: '55%', left: '10%', transform: 'scale(0.8)' }}></div>
          <div className="cloud opacity-50 cloud-4" style={{ top: '75%', right: '15%', transform: 'scale(1.2)' }}></div>
          <div className="cloud opacity-50 cloud-5" style={{ top: '25%', right: '5%', transform: 'scale(1.0)' }}></div>
          <div className="cloud opacity-50 cloud-6" style={{ top: '65%', left: '15%', transform: 'scale(1.3)' }}></div>
        </div>

        {/* Existing results content */}
        <div className="relative z-10">
          {/* Cloud reveal animation */}
          {showCloudAnimation && (
            <div className={`cloud-reveal-animation ${!showCloudAnimation ? 'complete' : ''}`}>
              <div className="cloud-left"></div>
              <div className="cloud-right"></div>
            </div>
          )}

          <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onTryAgain}
                className="px-6 py-4 text-md font-medium rounded-full shadow-elevated bg-white text-heaven-contrast border border-heaven-contrast hover:bg-heaven-contrast/5 transition-all flex items-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Try Different Parameters</span>
              </Button>
            </div>

            <HeavenlyResultsContainer>
              <ResultsDisplay results={results} onReset={onTryAgain} />
            </HeavenlyResultsContainer>

            <div className="pt-8"></div>

            <div className="text-center mb-6 pt-6">
              <Button
                variant="outline"
                onClick={() => setShowMethodology(!showMethodology)}
                className="methodology-toggle group"
              >
                <BookOpen className="mr-2 h-4 w-4 text-heaven-accent group-hover:text-heaven-contrast transition-colors" />
                {showMethodology ? 'Hide' : 'Peek behind'} the Methodology
                {!showMethodology && <Sparkles className="ml-2 h-3 w-3 text-heaven-accent animate-pulse-gentle" />}
              </Button>
            </div>

            {showMethodology && (
              <div className="pt-2 animate-fade-in">
                <MethodologySection
                  results={results}
                  selectedDoctrine={results.doctrine!}
                  allDogsGoToHeaven={results.allDogsGoToHeaven!}
                  dogGoodnessPercentage={results.dogGoodnessPercentage!}
                  insideSavedPercentage={results.insideSavedPercentage!}
                  outsideSavedPercentage={results.outsideSavedPercentage!}
                  edgeCases={results.edgeCases!}
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onTryAgain}
                className="px-6 py-4 text-md font-medium rounded-full shadow-elevated bg-white text-heaven-contrast border border-heaven-contrast hover:bg-heaven-contrast/5 transition-all flex items-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Try Different Parameters</span>
              </Button>
              
              <ShareButton 
                doctrine={results.doctrine?.name || 'Unknown'}
                totalSouls={results.humanSouls + results.dogSouls}
                humanSouls={results.humanSouls}
                dogSouls={results.dogSouls}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
