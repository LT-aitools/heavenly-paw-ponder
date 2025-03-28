import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalculationResult, formatNumber, formatNumberToReadable, getBaseFigures } from "@/utils/calculationLogic";
import { Doctrine } from "@/data/doctrineData";
import { BookOpen, Info, Calculator, ChevronDown, ScrollText } from "lucide-react";
import { BaseFigures } from "@/lib/supabase";

interface MethodologySectionProps {
  results: CalculationResult;
  selectedDoctrine: Doctrine;
  allDogsGoToHeaven: boolean;
  dogGoodnessPercentage: number;
  insideSavedPercentage: number;
  outsideSavedPercentage: number;
  edgeCases: Record<string, boolean>;
}

const MethodologySection = ({
  results,
  selectedDoctrine,
  allDogsGoToHeaven,
  dogGoodnessPercentage,
  insideSavedPercentage,
  outsideSavedPercentage,
  edgeCases
}: MethodologySectionProps) => {
  const [activeTab, setActiveTab] = useState('calculations');
  const [isExpanded, setIsExpanded] = useState(false);
  const [baseFigures, setBaseFigures] = useState<BaseFigures | null>(null);

  useEffect(() => {
    const fetchBaseFigures = async () => {
      try {
        const figures = await getBaseFigures(2025); // Using 2025 as the current year
        setBaseFigures(figures);
      } catch (error) {
        console.error('Error fetching base figures:', error);
      }
    };

    if (activeTab === 'figures') {
      fetchBaseFigures();
    }
  }, [activeTab]);

  // No results yet or atheism (no methodology to show)
  if ((results.humanSouls === 0 && results.dogSouls === 0) || selectedDoctrine.id === 'atheism') {
    return null;
  }

  // Get the religion name for display
  const getReligionName = () => {
    return selectedDoctrine.name.replace('Christianity (', '').replace(')', '').replace('Judaism (', '').replace(')', '').replace(' – ', ' ');
  };

  // Determine if purgatory is relevant
  const includePurgatory = selectedDoctrine.id === 'catholic';
  
  // Generate explanation text
  const getCalculationText = () => {
    let calculationText = [];
    
    // Extract the numbers from the explanations array
    const explanationLines = results.explanations;
    
    // Add each explanation line directly
    explanationLines.forEach(line => {
      if (line.trim()) {  // Only add non-empty lines
        if (line.startsWith('Total human souls')) {
          calculationText.push(<p key={line} className="font-bold">{line}</p>);
        } else {
          calculationText.push(line);
        }
      }
    });
    
    return calculationText;
  };

  return (
    <section className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-elevated p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Methodology</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary/80"
        >
          {isExpanded ? 'Hide Methodology' : 'Show Methodology'}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('calculations')}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${
                activeTab === 'calculations'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Calculator className="h-4 w-4 inline-block mr-1" />
              Calculations
            </button>
            <button
              onClick={() => setActiveTab('defaults')}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${
                activeTab === 'defaults'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Info className="h-4 w-4 inline-block mr-1" />
              Theological Defaults
            </button>
            <button
              onClick={() => setActiveTab('figures')}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${
                activeTab === 'figures'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <ScrollText className="h-4 w-4 inline-block mr-1" />
              Base Figures
            </button>
          </div>

          {/* Calculations Tab */}
          {activeTab === 'calculations' && (
            <div>
              <div className="flex items-center mb-3">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">How We Calculate</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Your results are calculated using the following formula:</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-mono">
                    Total Souls = (Human Souls × Inside Saved % × Dog Goodness %) + (Dog Souls × All Dogs Go to Heaven %)
                  </p>
                </div>
                <p>Where:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Human Souls = Total human population × Inside Saved %</li>
                  <li>Dog Souls = Total dog population × All Dogs Go to Heaven %</li>
                  <li>Inside Saved % = Percentage of humans who go to heaven based on your selected doctrine</li>
                  <li>Outside Saved % = Percentage of humans from other religions who go to heaven</li>
                  <li>Dog Goodness % = Percentage of dogs who are good enough to go to heaven</li>
                </ul>
              </div>
            </div>
          )}

          {/* Theological Defaults Tab */}
          {activeTab === 'defaults' && (
            <div>
              <div className="flex items-center mb-3">
                <Info className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Theological Defaults</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>Each doctrine has its own set of theological defaults:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Inside Saved %: The percentage of people from your selected religion who go to heaven</li>
                  <li>Outside Saved %: The percentage of people from other religions who go to heaven</li>
                  <li>All Dogs Go to Heaven %: Whether all dogs go to heaven or only good ones</li>
                  <li>Dog Goodness %: The percentage of dogs who are good enough to go to heaven</li>
                </ul>
                <p>These defaults can be adjusted using the sliders in the input section.</p>
              </div>
            </div>
          )}

          {/* Base Figures Tab */}
          {activeTab === 'figures' && (
            <div>
              <div className="flex items-center mb-3">
                <Info className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">The (Speculative) Base Figures</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">All numbers shown are in billions of souls. For example, "1.23" means 1.23 billion souls.</p>
                
                {/* Total Population Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humans</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dogs</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {baseFigures && (
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{baseFigures.year}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.humans)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.dogs)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Christian Denominations Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catholics</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evangelicals</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prot. Mainliners</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chris. Orthodox</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {baseFigures && (
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{baseFigures.year}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.catholic)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.protestant_evangelical)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.protestant_mainline)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.christian_orthodox)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Other Religions Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sunni</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shia</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orthodox Jews</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reform Jews</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Universalists</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atheists</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {baseFigures && (
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.muslim_sunni)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.muslim_shia)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.jew_orthodox)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.jew_reform)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.universalist)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.atheists_polytheists)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Edge Cases Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unbaptized infants</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Never heard of God</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In purgatory</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {baseFigures && (
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{baseFigures.year}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.unbaptized_infants)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.never_heard)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(baseFigures.in_purgatory)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MethodologySection;