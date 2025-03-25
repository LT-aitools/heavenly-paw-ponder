import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { Doctrine, edgeCases as allEdgeCases } from "@/data/doctrineData";

interface EdgeCasesSectionProps {
  selectedDoctrine: Doctrine;
  edgeCaseValues: Record<string, boolean>;
  setEdgeCaseValues: (values: Record<string, boolean>) => void;
}

const EdgeCasesSection = ({
  selectedDoctrine,
  edgeCaseValues,
  setEdgeCaseValues
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
    <section className="animate-fade-in space-y-6">
      <div className="flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-medium">Edge Cases & Exceptions</h2>
      </div>

      {/* Main Edge Cases */}
      {applicableEdgeCases.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Are the following groups allowed into heaven?
              </p>
              
              {applicableEdgeCases.map((edgeCase) => (
                <div key={edgeCase.id} className="flex justify-between items-center">
                  <Label htmlFor={`edge-case-${edgeCase.id}`} className="cursor-pointer">
                    {edgeCase.label}
                  </Label>
                  <Switch
                    id={`edge-case-${edgeCase.id}`}
                    checked={edgeCaseValues[edgeCase.id] || false}
                    onCheckedChange={(checked) => handleEdgeCaseChange(edgeCase.id, checked)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purgatory Section */}
      {purgatoryCase && selectedDoctrine.supportsPurgatory && (
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor={`edge-case-${purgatoryCase.id}`} className="cursor-pointer">
                  Should we count those still in purgatory as 'in heaven'?
                </Label>
                <Switch
                  id={`edge-case-${purgatoryCase.id}`}
                  checked={edgeCaseValues[purgatoryCase.id] || false}
                  onCheckedChange={(checked) => handleEdgeCaseChange(purgatoryCase.id, checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default EdgeCasesSection;