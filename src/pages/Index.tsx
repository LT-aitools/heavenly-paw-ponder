import { useEffect, useState } from 'react';
import AfterlifeCalculator from '@/components/AfterlifeCalculator';
import ResultsScreen from '@/components/ResultsScreen';
import { Sparkles, ChevronDown } from "lucide-react";
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/utils/calculationLogic';

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);

  // Add scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showResults]);

  const handleRunCensus = (results: CalculationResult) => {
    setCalculationResults(results);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!showResults ? (
        <>
          {/* Hero Section with Clouds */}
          <div className="heaven-gradient py-16 md:py-24 px-4 md:px-6 text-center relative overflow-hidden">
            {/* Cloud Elements */}
            <div className="clouds-container absolute inset-0 z-0">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>
              <div className="cloud cloud-4"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-xs shadow-sm text-primary font-medium mb-6">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Who's in Heaven? A Spiritual Census</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
                The Population of Heaven
              </h1>
              <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto animate-slide-up inline-block px-6 py-3 rounded-full bg-white/70 backdrop-blur-xs shadow-sm">
                Ever wondered if there are more dogs or humans in the afterlife? Now you can find out.
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="py-12 md:py-16 px-4 md:px-6 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <p className="text-lg md:text-xl text-gray-800 mb-12 leading-relaxed">
                  Welcome to the most serious, silly, and spiritually speculative population model ever made.
                  Using real demographic data, historical mortality estimates, and theological reasoning from a few major religions, 
                  this tool lets you calculate the current population of heaven — and whether it's mostly humans... or dogs.
                </p>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-700">You'll enter:</h2>
                  <ul className="space-y-2 text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Which religion defines the afterlife</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>What happens to babies, nonbelievers, and the unreached</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Whether dogs get judged — or just welcomed in</span>
                    </li>
                  </ul>
                  <p className="text-base text-gray-600">
                    Behind the scenes, we crunch the numbers to show you the afterlife breakdown.
                  </p>
                </div>
              </div>

              {/* Scroll button */}
              <div className="mt-12 text-center animate-bounce cursor-pointer" onClick={() => {
                document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <ChevronDown className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* Main Content - Inputs */}
          <div id="calculator-section" className="flex-grow py-12 md:py-20 px-4 md:px-6 bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-medium mb-2">...And your Dogtrine</h2>
              <p className="text-muted-foreground">
                Select a religious doctrine to calculate its heaven's population
              </p>
            </div>
            <AfterlifeCalculator onRunCensus={handleRunCensus} />
          </div>
        </>
      ) : (
        <ResultsScreen results={calculationResults!} onTryAgain={handleTryAgain} />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>This is a speculative data project exploring theological concepts in a light-hearted way.</p>
          <p className="mt-2">
            No citation or data here should be taken as definitive theological truth.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
