import { Card, CardContent } from "@/components/ui/card";
import { CalculationResult, formatNumber, formatNumberToReadable } from "@/utils/calculationLogic";
import { Sparkles, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ResultsDisplayProps {
  results: CalculationResult;
  onReset?: () => void;
}

const ResultsDisplay = ({ results, onReset }: ResultsDisplayProps) => {
  const { humanSouls, dogSouls, moreDogsOrHumans } = results;
  
  // Historical dates for the chart
  const timePoints = ['1750', '1800', '1850', '1900', '1950', '2000', '2025', '2050', '2100'];

  // Generate chart data based on current souls
  const generateHistoricalData = () => {
    return timePoints.map((year, index) => {
      const yearNum = parseInt(year);
      // Generate increasing percentages based on timeline
      const percentage = index / (timePoints.length - 1);
      const pastPercentage = yearNum >= 2000 ? 1 : percentage * 0.8;
      const futurePercentage = yearNum < 2000 ? 0 : (percentage - 0.8) * 5;
      
      return {
        year,
        "🧑 Humans": Math.round(humanSouls * (pastPercentage + (yearNum >= 2000 ? futurePercentage : 0))),
        "🐶 Dogs": Math.round(dogSouls * (pastPercentage + (yearNum >= 2000 ? futurePercentage : 0))),
      };
    });
  };

  const data = generateHistoricalData();
  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className="space-y-8 animate-scale-in">
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-heaven-blue text-primary font-medium mb-8">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>One hell (ahem, heaven) of a result:</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          In Heaven, There Are More...
        </h2>
        <div 
          className={`text-5xl md:text-6xl font-bold mt-6 mb-12 transition-all duration-500 ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className={`glass-card border-2 ${moreDogsOrHumans === 'humans' ? 'border-primary shadow-elevated' : 'border-border'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-medium">Human souls in heaven</h3>
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
                <h3 className="text-xl font-medium">Dog souls in heaven</h3>
              </div>
            </div>
            <div className={`text-4xl font-bold ${moreDogsOrHumans === 'dogs' ? 'text-heaven-contrast' : 'text-foreground'}`}>
              {formatNumberToReadable(dogSouls)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Population Distribution</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Total: {formatNumberToReadable(humanSouls + dogSouls)}
                </span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 30, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => {
                    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toString();
                  }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const humans = Number(payload[0].value) || 0;
                        const dogs = Number(payload[1].value) || 0;
                        const total = humans + dogs;
                        const dogPercentage = Math.round((dogs / total) * 100);
                        const humanPercentage = 100 - dogPercentage;
                        const isMostlyDogs = dogs > humans;
                        const yearNum = parseInt(label);
                        const isFuture = yearNum > 2025;
                        const isPresent = yearNum === 2025;
                        
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <div className="font-medium mb-2">{label} Afterlife Audit</div>
                            <div className="space-y-1">
                              <div>👤 Humans in heaven: {formatNumberToReadable(humans)}</div>
                              <div>🐶 Dogs in heaven: {formatNumberToReadable(dogs)}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {isPresent 
                                ? `Heaven is mostly (${isMostlyDogs ? dogPercentage : humanPercentage}%) ${isMostlyDogs ? 'canine' : 'human'}.`
                                : isFuture
                                ? `Heaven will be mostly (${isMostlyDogs ? dogPercentage : humanPercentage}%) ${isMostlyDogs ? 'canine' : 'human'}.`
                                : `So heaven was mostly (${isMostlyDogs ? dogPercentage : humanPercentage}%) ${isMostlyDogs ? 'canine' : 'human'}.`
                              }
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="🧑 Humans" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="🐶 Dogs" stackId="a" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
