
import { useState, useEffect } from 'react';
import { doctrines, Doctrine } from '@/data/doctrineData';
import DoctrineSelector from './DoctrineSelector';
import EdgeCasesSection from './EdgeCasesSection';
import GoodnessSliders from './GoodnessSliders';
import ResultsDisplay from './ResultsDisplay';
import MethodologySection from './MethodologySection';
import { calculateHeavenPopulation, CalculationResult } from '@/utils/calculationLogic';

const AfterlifeCalculator = () => {
  // State for doctrine selection
  const [selectedDoctrine, setSelectedDoctrine] = useState<Doctrine>(doctrines[0]);
  
  // State for dog doctrines
  const [allDogsGoToHeaven, setAllDogsGoToHeaven] = useState(true);
  const [dogGoodnessPercentage, setDogGoodnessPercentage] = useState(80);
  
  // State for edge cases
  const [edgeCaseValues, setEdgeCaseValues] = useState<Record<string, boolean>>(
    doctrines[0].edgeCases
  );
  
  // State for goodness percentages
  const [insideSavedPercentage, setInsideSavedPercentage] = useState(
    doctrines[0].defaultInsideSavedPercentage
  );
  const [outsideSavedPercentage, setOutsideSavedPercentage] = useState(
    doctrines[0].defaultOutsideSavedPercentage
  );
  
  // State for calculation results
  const [results, setResults] = useState<CalculationResult>({
    humanSouls: 0,
    dogSouls: 0,
    moreDogsOrHumans: 'equal',
    explanations: []
  });

  // Update edge cases when doctrine changes
  useEffect(() => {
    setEdgeCaseValues(selectedDoctrine.edgeCases);
    setInsideSavedPercentage(selectedDoctrine.defaultInsideSavedPercentage);
    setOutsideSavedPercentage(selectedDoctrine.defaultOutsideSavedPercentage);
  }, [selectedDoctrine]);

  // Calculate results when any input changes
  useEffect(() => {
    const newResults = calculateHeavenPopulation({
      doctrine: selectedDoctrine,
      allDogsGoToHeaven,
      dogGoodnessPercentage,
      insideSavedPercentage,
      outsideSavedPercentage,
      edgeCases: edgeCaseValues
    });
    
    setResults(newResults);
  }, [
    selectedDoctrine,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCaseValues
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      <div className="grid grid-cols-1 gap-10">
        <DoctrineSelector
          selectedDoctrine={selectedDoctrine}
          setSelectedDoctrine={setSelectedDoctrine}
          allDogsGoToHeaven={allDogsGoToHeaven}
          setAllDogsGoToHeaven={setAllDogsGoToHeaven}
          dogGoodnessPercentage={dogGoodnessPercentage}
          setDogGoodnessPercentage={setDogGoodnessPercentage}
        />
        
        <EdgeCasesSection
          selectedDoctrine={selectedDoctrine}
          edgeCaseValues={edgeCaseValues}
          setEdgeCaseValues={setEdgeCaseValues}
        />
        
        <GoodnessSliders
          selectedDoctrine={selectedDoctrine}
          insideSavedPercentage={insideSavedPercentage}
          setInsideSavedPercentage={setInsideSavedPercentage}
          outsideSavedPercentage={outsideSavedPercentage}
          setOutsideSavedPercentage={setOutsideSavedPercentage}
          edgeCaseValues={edgeCaseValues}
        />
        
        <ResultsDisplay results={results} />
        
        <MethodologySection
          results={results}
          selectedDoctrine={selectedDoctrine}
          allDogsGoToHeaven={allDogsGoToHeaven}
          dogGoodnessPercentage={dogGoodnessPercentage}
        />
      </div>
    </div>
  );
};

export default AfterlifeCalculator;
