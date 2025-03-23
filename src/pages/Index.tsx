
import { useEffect } from 'react';
import AfterlifeCalculator from '@/components/AfterlifeCalculator';
import { Sparkles } from "lucide-react";

const Index = () => {
  // Add scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="heaven-gradient py-16 md:py-24 px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-xs shadow-sm text-primary font-medium mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Interactive Census</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            The Population of Heaven
          </h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto animate-slide-up">
            Are there more dogs or humans in heaven? Customize theological assumptions and calculate 
            the population based on real-world data and doctrines.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12 md:py-20 px-4 md:px-6">
        <AfterlifeCalculator />
      </div>

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
