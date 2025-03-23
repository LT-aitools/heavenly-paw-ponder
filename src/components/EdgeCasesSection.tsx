
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    ec.applicableTo.includes(selectedDoctrine.id)
  );

  if (applicableEdgeCases.length === 0) {
    return null;
  }

  const handleEdgeCaseChange = (id: string, checked: boolean) => {
    setEdgeCaseValues({
      ...edgeCaseValues,
      [id]: checked
    });
  };

  return (
    <section className="animate-fade-in">
      <div className="mb-4 flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-medium">Edge Cases & Exceptions</h2>
      </div>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Should we count the following groups in heaven's population?
            </p>
            
            {applicableEdgeCases.map((edgeCase) => (
              <div key={edgeCase.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`edge-case-${edgeCase.id}`} className="cursor-pointer">
                    {edgeCase.label}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm">
                        <p>{edgeCase.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
    </section>
  );
};

export default EdgeCasesSection;
