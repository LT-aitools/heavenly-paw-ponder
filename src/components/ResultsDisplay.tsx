import { Card, CardContent } from "@/components/ui/card";
import { CalculationResult, formatNumber } from "@/utils/calculationLogic";
import { Sparkles, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface ResultsDisplayProps {
  results: CalculationResult;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const { humanSouls, dogSouls, moreDogsOrHumans } = results;

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
                <span className="text-sm text-muted-foreground">Total: {totalPopulation.toLocaleString()}</span>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={({ payload }) => (
                      <div className="flex flex-wrap justify-center gap-4 pt-4">
                        {payload?.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center space-x-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-muted-foreground">
                              {entry.value}: {((entry.payload.value / totalPopulation) * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
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
