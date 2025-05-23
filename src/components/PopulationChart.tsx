import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, formatNumberToReadable } from '@/utils/calculationLogic';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

// Historical dates for the chart
const timePoints = ['1750', '1800', '1850', '1900', '1950', '2000', '2025', '2050', '2100'];

interface PopulationChartProps {
  humanSouls: number;
  dogSouls: number;
}

const chartConfig = {
  "🧑 Humans": {
    label: "Humans",
    color: "#3b82f6"
  },
  "🐶 Dogs": {
    label: "Dogs",
    color: "#eab308"
  }
};

const PopulationChart = ({ humanSouls, dogSouls }: PopulationChartProps) => {
  // Generate chart data based on current souls
  // This is a simplified approach - in a real app, you'd have historical data
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

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Population Distribution</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Total: {formatNumberToReadable(humanSouls + dogSouls)}
              </span>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] w-full overflow-hidden">
            <ChartContainer config={chartConfig}>
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
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopulationChart;
