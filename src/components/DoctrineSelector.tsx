
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { doctrines, dogtrines, Doctrine } from "@/data/doctrineData";
import { Church, Paw } from "lucide-react";

interface DoctrineSelectorProps {
  selectedDoctrine: Doctrine;
  setSelectedDoctrine: (doctrine: Doctrine) => void;
  allDogsGoToHeaven: boolean;
  setAllDogsGoToHeaven: (value: boolean) => void;
  dogGoodnessPercentage: number;
  setDogGoodnessPercentage: (value: number) => void;
}

const DoctrineSelector = ({
  selectedDoctrine,
  setSelectedDoctrine,
  allDogsGoToHeaven,
  setAllDogsGoToHeaven,
  dogGoodnessPercentage,
  setDogGoodnessPercentage
}: DoctrineSelectorProps) => {
  const [hoverDoctrine, setHoverDoctrine] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="mb-4 flex items-center">
          <Church className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Choose Your Afterlife Doctrine</h2>
        </div>
        
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-4">
            <RadioGroup 
              value={selectedDoctrine.id}
              onValueChange={(value) => {
                const newDoctrine = doctrines.find(d => d.id === value);
                if (newDoctrine) setSelectedDoctrine(newDoctrine);
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {doctrines.map((doctrine) => (
                <div key={doctrine.id} className="relative">
                  <RadioGroupItem
                    value={doctrine.id}
                    id={`doctrine-${doctrine.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`doctrine-${doctrine.id}`}
                    className="flex flex-col justify-between h-full p-4 rounded-md border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer 
                      transition-all duration-200 ease-in-out
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-foreground 
                      peer-data-[state=checked]:bg-primary/5"
                    onMouseEnter={() => setHoverDoctrine(doctrine.id)}
                    onMouseLeave={() => setHoverDoctrine(null)}
                  >
                    <div className="font-medium text-left">
                      {doctrine.name}
                    </div>
                    {(doctrine.id === selectedDoctrine.id || hoverDoctrine === doctrine.id) && (
                      <p className="text-sm text-muted-foreground mt-2 text-left animate-fade-in">
                        {doctrine.description}
                      </p>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-center">
          <Paw className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-xl font-medium">Choose Your Dogtrine</h2>
        </div>
        
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-4">
            <RadioGroup 
              value={allDogsGoToHeaven ? 'allDogsGood' : 'someDogsGood'}
              onValueChange={(value) => {
                setAllDogsGoToHeaven(value === 'allDogsGood');
              }}
              className="space-y-4"
            >
              {dogtrines.map((dogtrine) => (
                <div key={dogtrine.id} className="relative">
                  <RadioGroupItem
                    value={dogtrine.id}
                    id={`dogtrine-${dogtrine.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`dogtrine-${dogtrine.id}`}
                    className="flex flex-col justify-between h-full p-4 rounded-md border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer 
                      transition-all duration-200 ease-in-out
                      peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-foreground 
                      peer-data-[state=checked]:bg-primary/5"
                  >
                    <div className="font-medium text-left">{dogtrine.name}</div>
                    <p className="text-sm text-muted-foreground mt-2 text-left">
                      {dogtrine.description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {!allDogsGoToHeaven && (
              <div className="mt-6 space-y-4 animate-slide-up">
                <Label htmlFor="dog-goodness" className="text-sm font-medium">
                  What % of dogs are good?
                </Label>
                <div className="flex items-center space-x-2">
                  <input
                    id="dog-goodness"
                    type="range"
                    min="0"
                    max="100"
                    value={dogGoodnessPercentage}
                    onChange={(e) => setDogGoodnessPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-10">{dogGoodnessPercentage}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DoctrineSelector;
