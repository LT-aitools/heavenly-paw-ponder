import { useState, useEffect } from 'react';
import ResultsDisplay from './ResultsDisplay';
import MethodologySection from './MethodologySection';
import ShareButton from './ShareButton';
import { CalculationResult } from '@/utils/calculationLogic';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ResultsScreenProps {
  results: CalculationResult;
  onTryAgain: () => void;
}

const ResultsScreen = ({ results, onTryAgain }: ResultsScreenProps) => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onTryAgain}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Different Parameters
          </Button>
          <ShareButton results={results} />
        </div>

        <ResultsDisplay results={results} onReset={onTryAgain} />

        <Separator />

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowMethodology(!showMethodology)}
          >
            {showMethodology ? 'Hide' : 'Show'} Methodology
          </Button>
        </div>

        {showMethodology && (
          <MethodologySection
            results={results}
            selectedDoctrine={results.doctrine!}
            allDogsGoToHeaven={results.allDogsGoToHeaven!}
            dogGoodnessPercentage={results.dogGoodnessPercentage!}
            insideSavedPercentage={results.insideSavedPercentage!}
            outsideSavedPercentage={results.outsideSavedPercentage!}
            edgeCases={results.edgeCases!}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;
