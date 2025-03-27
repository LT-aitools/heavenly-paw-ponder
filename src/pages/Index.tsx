
import { useEffect, useState } from 'react';
import AfterlifeCalculator from '@/components/AfterlifeCalculator';
import ResultsScreen from '@/components/ResultsScreen';
import { Sparkles, ChevronDown, CloudSun, Dog, User } from "lucide-react";
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
          <div className="heaven-gradient-pastel py-16 md:py-24 px-4 md:px-6 text-center relative overflow-hidden">
            {/* Cloud Elements */}
            <div className="clouds-container absolute inset-0 z-0">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>
              <div className="cloud cloud-4"></div>
              
              {/* Whimsical Angel Elements */}
              <div className="angel angel-1">
                <Dog className="w-full h-full text-heaven-accent" />
                <div className="halo absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <div className="angel angel-2">
                <User className="w-full h-full text-heaven-contrast" />
                <div className="halo absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-xs shadow-sm text-heaven-contrast font-medium mb-8">
                <Sparkles className="mr-2 h-4 w-4 text-heaven-accent animate-pulse-gentle" />
                <span>Who's in Heaven? A Spiritual Census</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in text-heaven-contrast">
                The Population of Heaven
              </h1>
              <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto animate-slide-up [text-shadow:_0_0_8px_rgba(255,255,255,0.3)]">
                Ever wondered if there are more dogs or humans in the afterlife? Now you can find out.
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="py-12 md:py-16 px-4 md:px-6 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-heaven-blue/20 to-transparent"></div>
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <p className="text-lg md:text-xl text-gray-800 mb-12 leading-[1.7]">
                  Welcome to the most serious, silly, and spiritually speculative population model ever made.
                  Using real demographic data, historical mortality estimates, and theological reasoning from a few major religions, 
                  this tool lets you calculate the current population of heaven — and whether it's mostly humans... or dogs.
                </p>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-heaven-contrast">You'll enter:</h2>
                  <ul className="space-y-4 text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-3 flex-shrink-0 h-8 w-8 rounded-full bg-heaven-accent/20 flex items-center justify-center">
                        <CloudSun className="h-4 w-4 text-heaven-contrast" />
                      </span>
                      <span className="mt-0.5">Which religion defines the afterlife</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex-shrink-0 h-8 w-8 rounded-full bg-heaven-accent/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-heaven-contrast" />
                      </span>
                      <span className="mt-0.5">What happens to babies, nonbelievers, and the unreached</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 flex-shrink-0 h-8 w-8 rounded-full bg-heaven-accent/20 flex items-center justify-center">
                        <Dog className="h-4 w-4 text-heaven-contrast" />
                      </span>
                      <span className="mt-0.5">Whether dogs get judged — or just welcomed in</span>
                    </li>
                  </ul>
                  <p className="text-base text-gray-600 mt-6">
                    Behind the scenes, we crunch the numbers to show you the afterlife breakdown.
                  </p>
                </div>
              </div>

              {/* Scroll button */}
              <div className="mt-12 text-center cursor-pointer" onClick={() => {
                document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <div className="inline-flex flex-col items-center animate-bounce">
                  <span className="text-sm text-heaven-contrast mb-2">Start your census</span>
                  <ChevronDown className="h-8 w-8 text-heaven-accent hover:text-heaven-contrast transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Inputs */}
          <div 
            id="calculator-section" 
            className="flex-grow py-12 md:py-20 px-4 md:px-6 bg-gray-50/70"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23bbdefb' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          >
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
          <div className="mt-4 flex items-center justify-center space-x-1">
            <Sparkles className="h-3 w-3 text-heaven-accent" />
            <span className="text-xs text-heaven-accent/80">A Heavenly Calculation</span>
            <Sparkles className="h-3 w-3 text-heaven-accent" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
