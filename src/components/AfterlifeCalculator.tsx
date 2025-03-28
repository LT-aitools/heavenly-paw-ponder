import { useState, useEffect } from 'react';
import { doctrines, Doctrine } from '@/data/doctrineData';
import DoctrineSelector from './DoctrineSelector';
import EdgeCasesSection from './EdgeCasesSection';
import GoodnessSliders from './GoodnessSliders';
import { calculateSoulsInHeaven, calculateHistoricalData, CalculationResult } from '@/utils/calculationLogic';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AfterlifeCalculatorProps {
  onRunCensus: (results: CalculationResult & { historicalData: { year: string; humanSouls: number; dogSouls: number; }[] }) => void;
}

const AfterlifeCalculator = ({ onRunCensus }: AfterlifeCalculatorProps) => {
  // State for doctrine selection - start with Catholic
  const [selectedDoctrine, setSelectedDoctrine] = useState<Doctrine | null>(doctrines.find(d => d.id === 'catholic'));
  
  // State for dog doctrines
  const [allDogsGoToHeaven, setAllDogsGoToHeaven] = useState(true);
  const [dogGoodnessPercentage, setDogGoodnessPercentage] = useState(80);
  
  // State for edge cases - start with empty object
  const [edgeCaseValues, setEdgeCaseValues] = useState<Record<string, boolean>>({});
  
  // State for goodness percentages - start with 0
  const [insideSavedPercentage, setInsideSavedPercentage] = useState(0);
  const [outsideSavedPercentage, setOutsideSavedPercentage] = useState(0);
  
  // State for calculation results
  const [results, setResults] = useState<CalculationResult>({
    humanSouls: 0,
    dogSouls: 0,
    moreDogsOrHumans: 'equal',
    explanations: []
  });

  // Update edge cases when doctrine changes
  useEffect(() => {
    if (selectedDoctrine) {
      // Initialize edge cases from the selected doctrine's default values
      setEdgeCaseValues(selectedDoctrine.edgeCases);
      
      // For atheism, force insideSavedPercentage to 0
      if (selectedDoctrine.id === 'atheism') {
        setInsideSavedPercentage(0);
        setOutsideSavedPercentage(selectedDoctrine.defaultOutsideSavedPercentage);
      } else {
        setInsideSavedPercentage(selectedDoctrine.defaultInsideSavedPercentage);
        setOutsideSavedPercentage(selectedDoctrine.defaultOutsideSavedPercentage);
      }
    } else {
      setEdgeCaseValues({});
      setInsideSavedPercentage(0);
      setOutsideSavedPercentage(0);
    }
  }, [selectedDoctrine]);

  // Calculate results when inputs change
  useEffect(() => {
    const calculateResults = async () => {
      if (!selectedDoctrine) {
        setResults({
          humanSouls: 0,
          dogSouls: 0,
          moreDogsOrHumans: 'equal',
          explanations: []
        });
        return;
      }

      try {
        const params = {
          doctrine: selectedDoctrine,
          currentYear: 2025,
          allDogsGoToHeaven,
          dogGoodnessPercentage,
          insideSavedPercentage,
          outsideSavedPercentage,
          edgeCases: edgeCaseValues
        };

        const [newResults, historicalResults] = await Promise.all([
          calculateSoulsInHeaven(params),
          calculateHistoricalData(params)
        ]);
        
        const finalResults = {
          ...newResults,
          historicalData: historicalResults,
          doctrine: selectedDoctrine,
          allDogsGoToHeaven,
          dogGoodnessPercentage,
          insideSavedPercentage,
          outsideSavedPercentage,
          edgeCases: edgeCaseValues
        };
        
        setResults(finalResults);
      } catch (error) {
        console.error('Error calculating results:', error);
      }
    };

    calculateResults();
  }, [
    selectedDoctrine,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCaseValues
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="grid grid-cols-1 gap-12">
        <DoctrineSelector
          selectedDoctrine={selectedDoctrine}
          setSelectedDoctrine={setSelectedDoctrine}
          allDogsGoToHeaven={allDogsGoToHeaven}
          setAllDogsGoToHeaven={setAllDogsGoToHeaven}
          dogGoodnessPercentage={dogGoodnessPercentage}
          setDogGoodnessPercentage={setDogGoodnessPercentage}
          hasError={false}
        />
        
        {selectedDoctrine && (
          <>
            <EdgeCasesSection
              selectedDoctrine={selectedDoctrine}
              edgeCaseValues={edgeCaseValues}
              setEdgeCaseValues={setEdgeCaseValues}
              validationErrors={{}}
            />
            
            <GoodnessSliders
              selectedDoctrine={selectedDoctrine}
              insideSavedPercentage={insideSavedPercentage}
              setInsideSavedPercentage={setInsideSavedPercentage}
              outsideSavedPercentage={outsideSavedPercentage}
              setOutsideSavedPercentage={setOutsideSavedPercentage}
              edgeCaseValues={edgeCaseValues}
            />
          </>
        )}
        
        <div className="flex justify-center pt-6">
          <Button 
            onClick={() => {
              // Show gates immediately (but keep them closed)
              const gatesElement = document.querySelector('.heaven-gates') as HTMLElement;
              if (gatesElement) {
                gatesElement.style.display = 'block';
                gatesElement.style.opacity = '1';
              }

              const params = {
                doctrine: selectedDoctrine,
                currentYear: 2025,
                allDogsGoToHeaven,
                dogGoodnessPercentage,
                insideSavedPercentage,
                outsideSavedPercentage,
                edgeCases: edgeCaseValues
              };

              // Calculate results in the background
              Promise.all([
                calculateSoulsInHeaven(params),
                calculateHistoricalData(params)
              ]).then(([newResults, historicalResults]) => {
                const finalResults = {
                  ...newResults,
                  historicalData: historicalResults,
                  doctrine: selectedDoctrine,
                  allDogsGoToHeaven,
                  dogGoodnessPercentage,
                  insideSavedPercentage,
                  outsideSavedPercentage,
                  edgeCases: edgeCaseValues
                };
                onRunCensus(finalResults);
              }).catch(error => {
                console.error('Error calculating results:', error);
                // If there's an error, hide the gates
                if (gatesElement) {
                  gatesElement.style.display = 'none';
                }
              });
            }}
            className="px-8 py-6 text-lg font-medium rounded-full shadow-elevated bg-heaven-contrast text-white hover:bg-heaven-contrast/90 transition-all"
          >
            <span>Run My Heaven Census 🐶🧍</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AfterlifeCalculator;
