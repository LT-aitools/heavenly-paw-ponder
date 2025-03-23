
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalculationResult } from "@/utils/calculationLogic";
import { Doctrine } from "@/data/doctrineData";
import { ChevronDown, ChevronUp, BookOpen, Info, Calculator } from "lucide-react";

interface MethodologySectionProps {
  results: CalculationResult;
  selectedDoctrine: Doctrine;
  allDogsGoToHeaven: boolean;
  dogGoodnessPercentage: number;
}

const MethodologySection = ({
  results,
  selectedDoctrine,
  allDogsGoToHeaven,
  dogGoodnessPercentage
}: MethodologySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // No results yet or atheism (no methodology to show)
  if ((results.humanSouls === 0 && results.dogSouls === 0) || selectedDoctrine.id === 'atheism') {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <Button
        variant="outline"
        className="flex w-full items-center justify-between p-4 text-left font-medium border-heaven-lightBlue border-2 rounded-md bg-white hover:bg-heaven-blue/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          <span>Peek behind the theological curtain</span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="pt-2 pb-4 animate-slide-down">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <Calculator className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">The Calculations</h3>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  {results.explanations.map((explanation, index) => (
                    <p key={index}>{explanation}</p>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">The Theological Defaults</h3>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    For {selectedDoctrine.name}, the defaults were set based on common theological understandings:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {selectedDoctrine.id === 'catholic' && (
                      <>
                        <li>Unbaptized infants: Traditionally excluded from heaven (Limbo theory)</li>
                        <li>Purgatory: 85% of heaven-bound souls spend time in purgatory first</li>
                        <li>Outside salvation: Limited to specific circumstances</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'evangelical' && (
                      <>
                        <li>Salvation through faith in Christ alone</li>
                        <li>Limited salvation outside the faith</li>
                        <li>All children below the age of accountability are saved</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'mainlineProtestant' && (
                      <>
                        <li>More inclusive view of salvation</li>
                        <li>Those who never heard may be saved through general revelation</li>
                        <li>God's grace extends beyond explicit faith</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'orthodoxChristian' && (
                      <>
                        <li>Emphasis on theosis (becoming like God)</li>
                        <li>Salvation through participation in Church sacraments</li>
                        <li>Uncertain about salvation outside the Church</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'muslim' && (
                      <>
                        <li>Paradise primarily for believers in Allah</li>
                        <li>Those who never heard may receive mercy</li>
                        <li>"People of the Book" may have opportunity for salvation</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'judaismOrthodox' && (
                      <>
                        <li>Focus on righteousness over specific beliefs</li>
                        <li>Non-Jews held to Noahide laws, not full Jewish law</li>
                        <li>Less emphasis on afterlife compared to righteous living</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'judaismReform' && (
                      <>
                        <li>Broad view of divine acceptance</li>
                        <li>Emphasis on ethical monotheism</li>
                        <li>Good deeds valued over specific beliefs</li>
                      </>
                    )}
                    {selectedDoctrine.id === 'universalist' && (
                      <>
                        <li>Universal reconciliation - all souls eventually saved</li>
                        <li>Divine love ultimately redeems all creation</li>
                        <li>Punishment may exist but is not eternal</li>
                      </>
                    )}
                  </ul>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    <span className="font-medium">Dog salvation:</span>{' '}
                    {allDogsGoToHeaven 
                      ? "All dogs automatically qualify for heaven regardless of behavior." 
                      : `${dogGoodnessPercentage}% of dogs are good enough for heaven.`}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-3">
                  <Info className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">The (Speculative) Base Figures</h3>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Human population:</span> Approximately 109 billion humans have ever lived and died.
                  </p>
                  <p>
                    <span className="font-medium">Dog population:</span> Estimated 90 billion domesticated dogs have lived throughout history.
                  </p>
                  <p>
                    <span className="font-medium">Data sources:</span> Population Research Bureau, historical demographic studies, and pet population trend analysis.
                  </p>
                  <p className="text-xs mt-2 italic">
                    Note: These are educated estimates based on available research, not definitive counts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default MethodologySection;
