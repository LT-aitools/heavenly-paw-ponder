import { useEffect, useState, useRef } from 'react';
import AfterlifeCalculator from '@/components/AfterlifeCalculator';
import ResultsScreen from '@/components/ResultsScreen';
import { Sparkles, ChevronDown, User, Dog } from "lucide-react";
import { CalculationResult } from '@/utils/calculationLogic';

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [gatesOpen, setGatesOpen] = useState(false);
  const heavenGatesRef = useRef<HTMLDivElement>(null);

  // Add scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showResults]);

  const handleRunCensus = (results: CalculationResult) => {
    setCalculationResults(results);
    
    // Show gates animation before revealing results
    const gatesElement = heavenGatesRef.current;
    if (gatesElement) {
      gatesElement.style.display = 'block';
      
      // Wait a short moment then start animation
      setTimeout(() => {
        setGatesOpen(true);
        
        // After animation completes, show results and hide gates
        setTimeout(() => {
          setShowResults(true);
          
          // Hide gates after showing results
          setTimeout(() => {
            gatesElement.style.display = 'none';
            setGatesOpen(false);
          }, 500);
        }, 1500);
      }, 100);
    } else {
      setShowResults(true);
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Heaven Gates Animation */}
      <div 
        ref={heavenGatesRef} 
        className={`heaven-gates ${gatesOpen ? 'open' : ''}`} 
        style={{ display: 'none' }}
      >
        <div className="gate-content">
          <h2 className="gate-title">The Gates of Heaven</h2>
          <p className="gate-subtitle">Opening to reveal your results...</p>
        </div>
        <div className="gate-left"></div>
        <div className="gate-right"></div>
        <div className="gate-clouds">
          <div className="cloud" style={{ top: '20%', left: '10%', transform: 'scale(0.8)' }}></div>
          <div className="cloud" style={{ top: '40%', right: '15%', transform: 'scale(1.2)' }}></div>
          <div className="cloud" style={{ bottom: '20%', left: '20%', transform: 'scale(1)' }}></div>
        </div>
      </div>

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
            
            {/* Floating Icons */}
            <User className="floating-icon floating-person text-white w-12 h-12" />
            <Dog className="floating-icon floating-dog text-white w-12 h-12" />
            
            {/* Additional Floating Icons */}
            <User className="floating-icon floating-person-2 w-12 h-12" />
            <Dog className="floating-icon floating-dog-2 w-12 h-12" />
            <User className="floating-icon floating-person-3 w-12 h-12" />
            <Dog className="floating-icon floating-dog-3 w-12 h-12" />
            <User className="floating-icon floating-person-4 w-12 h-12" />
            <Dog className="floating-icon floating-dog-4 w-12 h-12" />
            
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-xs shadow-sm text-primary font-medium mb-8">
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Who's in Heaven? A Spiritual Census</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight mb-6 animate-fade-in">
                The Great Heaven Census
              </h1>
            </div>
          </div>

          {/* Description Section */}
          <div className="py-12 md:py-16 px-4 md:px-6 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg">
                <p className="text-lg md:text-xl text-gray-800 mb-12 leading-[1.7]">
                  Welcome to the most serious, silly, and spiritually speculative population model ever made.
                  Using real demographic data, historical mortality estimates, and theological reasoning from a few major religions, 
                  this tool lets you calculate the current population of heaven — and whether it's mostly humans... or dogs.
                </p>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-700 font-playfair">You'll enter:</h2>
                  <ul className="space-y-2 text-base text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 text-heaven-accent">•</span>
                      <span>Which religion defines the afterlife</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-heaven-accent">•</span>
                      <span>What happens to babies, nonbelievers, and the unreached</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-heaven-accent">•</span>
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
                <ChevronDown className="h-8 w-8 text-primary hover:text-primary/90 transition-colors mx-auto" />
              </div>
            </div>
          </div>

          {/* Main Content - Inputs */}
          <div id="calculator-section" className="flex-grow py-12 md:py-20 px-4 md:px-6 relative bg-blue-50">
            {/* Background Clouds */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="cloud opacity-50 cloud-1" style={{ top: '10%', left: '5%', transform: 'scale(0.8)' }}></div>
              <div className="cloud opacity-50 cloud-2" style={{ top: '30%', right: '10%', transform: 'scale(1.2)' }}></div>
              <div className="cloud opacity-50 cloud-3" style={{ top: '60%', left: '15%', transform: 'scale(0.9)' }}></div>
              <div className="cloud opacity-50 cloud-4" style={{ top: '80%', right: '8%', transform: 'scale(1.1)' }}></div>
            </div>

            {/* Calculator Content */}
            <div className="relative z-10">
              <AfterlifeCalculator onRunCensus={handleRunCensus} />
            </div>
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
