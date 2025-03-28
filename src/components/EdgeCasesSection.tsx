import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Scale } from "lucide-react";
import { Doctrine, edgeCases as allEdgeCases } from "@/data/doctrineData";

interface EdgeCasesSectionProps {
  selectedDoctrine: Doctrine;
  edgeCaseValues: Record<string, boolean>;
  setEdgeCaseValues: (values: Record<string, boolean>) => void;
  validationErrors?: Record<string, boolean>;
}

const EdgeCasesSection = ({
  selectedDoctrine,
  edgeCaseValues,
  setEdgeCaseValues,
  validationErrors
}: EdgeCasesSectionProps) => {
  // Filter edge cases applicable to the selected doctrine
  const applicableEdgeCases = allEdgeCases.filter(ec => 
    ec.applicableTo.includes(selectedDoctrine.id) && ec.id !== 'purgatory'
  );

  const purgatoryCase = allEdgeCases.find(ec => ec.id === 'purgatory');

  if (applicableEdgeCases.length === 0 && !purgatoryCase) {
    return null;
  }

  const handleEdgeCaseChange = (id: string, checked: boolean) => {
    setEdgeCaseValues({
      ...edgeCaseValues,
      [id]: checked
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold font-playfair">3. Any exceptions?</h2>
        </div>
        <p className="text-muted-foreground">Theology is full of edge cases: Should we include these groups? We've offered some default choices based on your doctrine, but you don't have to be so dogmatic about them.</p>
      </div>

      <div className="space-y-2">
        {applicableEdgeCases.map((edgeCase) => (
          <Card 
            key={edgeCase.id} 
            className={validationErrors?.[`edge-case-${edgeCase.id}`] ? 'border-red-500' : ''}
            id={`edge-case-${edgeCase.id}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-heaven-accent" />
                  <span className="text-sm font-medium leading-none">{edgeCase.label}</span>
                </div>
                <Switch
                  checked={edgeCaseValues[edgeCase.id] || false}
                  onCheckedChange={(checked) => handleEdgeCaseChange(edgeCase.id, checked)}
                  className="data-[state=checked]:bg-heaven-accent"
                />
              </div>
              {validationErrors?.[`edge-case-${edgeCase.id}`] && (
                <p className="text-sm text-red-500 mt-2">This field is required</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purgatory Section */}
      {purgatoryCase && selectedDoctrine.supportsPurgatory && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Label htmlFor={`edge-case-${purgatoryCase.id}`} className="cursor-pointer flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-heaven-accent" />
                <span>Count those still in purgatory as 'in heaven'?</span>
              </Label>
              <Switch
                id={`edge-case-${purgatoryCase.id}`}
                checked={edgeCaseValues[purgatoryCase.id] || false}
                onCheckedChange={(checked) => handleEdgeCaseChange(purgatoryCase.id, checked)}
                className="data-[state=checked]:bg-heaven-accent"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EdgeCasesSection;
