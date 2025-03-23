
import { Card, CardContent } from "@/components/ui/card";
import { CalculationResult, formatNumber } from "@/utils/calculationLogic";
import { Sparkles, Users, Heart } from "lucide-react";

interface ResultsDisplayProps {
  results: CalculationResult;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const { humanSouls, dogSouls, moreDogsOrHumans } = results;

  return (
    <div className="space-y-8 animate-scale-in">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-heaven-blue text-primary font-medium mb-4">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Results</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          In Heaven, There Are More...
        </h2>
        <div 
          className={`text-5xl md:text-6xl font-bold mt-4 mb-6 transition-all duration-500 ${
            moreDogsOrHumans === 'dogs' 
              ? 'text-heaven-contrast' 
              : moreDogsOrHumans === 'humans' 
                ? 'text-primary' 
                : 'text-muted-foreground'
          }`}
        >
          {moreDogsOrHumans === 'equal' 
            ? '👥 = 🐶 Equal Numbers' 
            : moreDogsOrHumans === 'dogs' 
              ? '🐶 Dogs' 
              : '👥 Humans'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`glass-card border-2 ${moreDogsOrHumans === 'humans' ? 'border-primary shadow-elevated' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-medium">Human Souls</h3>
              </div>
            </div>
            <div className={`text-4xl font-bold ${moreDogsOrHumans === 'humans' ? 'text-primary' : 'text-foreground'}`}>
              {formatNumberToReadable(humanSouls)}
            </div>
          </CardContent>
        </Card>

        <Card className={`glass-card border-2 ${moreDogsOrHumans === 'dogs' ? 'border-heaven-contrast shadow-elevated' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-heaven-contrast mr-2" />
                <h3 className="text-xl font-medium">Dog Souls</h3>
              </div>
            </div>
            <div className={`text-4xl font-bold ${moreDogsOrHumans === 'dogs' ? 'text-heaven-contrast' : 'text-foreground'}`}>
              {formatNumberToReadable(dogSouls)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Function to format numbers into readable format (millions, billions)
const formatNumberToReadable = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} billion`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  } else {
    return num.toString();
  }
};

export default ResultsDisplay;
