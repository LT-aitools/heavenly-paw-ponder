
import { useState, useEffect } from 'react';
import ResultsDisplay from './ResultsDisplay';
import MethodologySection from './MethodologySection';
import ShareButton from './ShareButton';
import { CalculationResult } from '@/utils/calculationLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResultsScreenProps {
  results: CalculationResult;
  onTryAgain: () => void;
}

const ResultsScreen = ({ results, onTryAgain }: ResultsScreenProps) => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="flex items-center gap-2 btn-whimsy-outline"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Different Parameters
          </Button>
        </div>

        <ResultsDisplay results={results} onReset={onTryAgain} />

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
            className="flex items-center gap-2 btn-whimsy-outline w-full sm:w-auto h-12"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Different Parameters
          </Button>
          
          <ShareButton results={results} />
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
