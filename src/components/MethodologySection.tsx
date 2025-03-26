import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalculationResult, formatNumber, formatNumberToReadable } from "@/utils/calculationLogic";
import { Doctrine } from "@/data/doctrineData";
import { ChevronDown, ChevronUp, BookOpen, Info, Calculator } from "lucide-react";

interface MethodologySectionProps {
  results: CalculationResult;
  selectedDoctrine: Doctrine;
  allDogsGoToHeaven: boolean;
  dogGoodnessPercentage: number;
  insideSavedPercentage: number;
  outsideSavedPercentage: number;
  edgeCases: Record<string, boolean>;
}

const MethodologySection = ({
  results,
  selectedDoctrine,
  allDogsGoToHeaven,
  dogGoodnessPercentage,
  insideSavedPercentage,
  outsideSavedPercentage,
  edgeCases
}: MethodologySectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculations');

  // No results yet or atheism (no methodology to show)
  if ((results.humanSouls === 0 && results.dogSouls === 0) || selectedDoctrine.id === 'atheism') {
    return null;
  }

  // Get the religion name for display
  const getReligionName = () => {
    return selectedDoctrine.name.replace('Christianity (', '').replace(')', '').replace('Judaism (', '').replace(')', '').replace(' – ', ' ');
  };

  // Determine if purgatory is relevant
  const includePurgatory = selectedDoctrine.id === 'catholic';
  
  // Calculate total numbers for display
  const totalHumans = 105000; // millions
  const religionPopulation = totalHumans * (selectedDoctrine.percentageInsideDoctrine / 100);
  const nonReligionPopulation = totalHumans - religionPopulation;
  
  // Generate explanation text
  const getCalculationText = () => {
    let calculationText = [];
    
    // Extract base figures from the explanations
    const basePopulationMatch = results.explanations[0].match(/world population of (.+) and dog population of (.+)\./);
    const worldPopulation = basePopulationMatch ? basePopulationMatch[1] : '0';
    const dogPopulation = basePopulationMatch ? basePopulationMatch[2] : '0';
    
    // 1. Religion calculation - always shown
    const peopleInReligion = results.explanations[1].match(/People in .+: (.+) \(/)?.[1] || '0';
    calculationText.push(`${getReligionName()}: ${peopleInReligion} × ${insideSavedPercentage}% "Good" = ${formatNumber(parseInt(peopleInReligion.replace(/,/g, '')) * (insideSavedPercentage / 100))}`);
    
    // 2. Edge cases - only show if they were an option for this doctrine
    if (selectedDoctrine.id === 'catholic') {
      const unbaptizedInfants = Math.round(parseInt(worldPopulation.replace(/,/g, '')) * 0.004); // 0.4% of world population
      if (edgeCases.unbaptizedInfants) {
        calculationText.push(`Unbaptized infants (included): ${formatNumber(unbaptizedInfants)}`);
      } else {
        calculationText.push(`Unbaptized infants (excluded): Zero`);
      }
    }
    
    // Only show never heard if it was an option
    if (selectedDoctrine.edgeCases.neverHeard !== undefined) {
      const neverHeardPopulation = Math.round(parseInt(worldPopulation.replace(/,/g, '')) * 0.095); // 9.5% of world population
      if (edgeCases.neverHeard) {
        calculationText.push(`People who have never heard of the religion (included): ${formatNumber(neverHeardPopulation)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(neverHeardPopulation * (outsideSavedPercentage / 100))}`);
      } else {
        calculationText.push(`People who have never heard of the religion (excluded): Zero`);
      }
    }
    
    // Only show other monotheists if it was an option
    if (selectedDoctrine.edgeCases.otherMonotheists !== undefined) {
      const monotheistPopulation = Math.round(parseInt(worldPopulation.replace(/,/g, '')) * 0.31); // 31% of world population
      if (edgeCases.otherMonotheists) {
        calculationText.push(`Other monotheists (included): ${formatNumber(monotheistPopulation)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(monotheistPopulation * (outsideSavedPercentage / 100))}`);
      } else {
        calculationText.push(`Other monotheists (excluded): Zero`);
      }
    }
    
    // Only show atheists/polytheists if it was an option
    if (selectedDoctrine.edgeCases.atheistsPolytheists !== undefined) {
      const atheistPolytheistPopulation = Math.round(parseInt(worldPopulation.replace(/,/g, '')) * 0.69); // 69% of world population
      if (edgeCases.atheistsPolytheists) {
        calculationText.push(`Atheists or Polytheists (everyone else) (included): ${formatNumber(atheistPolytheistPopulation)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(atheistPolytheistPopulation * (outsideSavedPercentage / 100))}`);
      } else {
        calculationText.push(`Atheists or Polytheists (everyone else) (excluded): Zero`);
      }
    }
    
    // Only show purgatory for Catholic doctrine
    if (selectedDoctrine.id === 'catholic') {
      const purgatory = Math.round(parseInt(worldPopulation.replace(/,/g, '')) * 0.025); // 2.5% of world population
      if (edgeCases.purgatory) {
        calculationText.push(`Those in Purgatory (included): ${formatNumber(purgatory)}`);
      } else {
        calculationText.push(`Those in Purgatory (excluded): Zero`);
      }
    }
    
    // Add a separator before dog calculations
    calculationText.push('');
    
    // Dog calculations
    const dogPopulationNum = parseInt(dogPopulation.replace(/,/g, ''));
    if (allDogsGoToHeaven) {
      calculationText.push(`Dogs: ${dogPopulation} × 100% (All dogs go to heaven) = ${formatNumber(dogPopulationNum)}`);
    } else {
      calculationText.push(`Dogs: ${dogPopulation} × ${dogGoodnessPercentage}% "Good" = ${formatNumber(dogPopulationNum * (dogGoodnessPercentage / 100))}`);
    }
    
    // Total - always shown
    calculationText.push(`Total = ${formatNumberToReadable(results.humanSouls + results.dogSouls)}`);
    
    return calculationText;
  };

  return (
    <section className="animate-fade-in">
      <Button
        variant="outline"
        className="flex w-full items-center justify-between p-4 text-left font-medium border-heaven-lightBlue border border-opacity-70 rounded-md bg-white hover:bg-heaven-blue/20 transition-colors"
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
              {/* Navigation tabs */}
              <div className="flex border-b border-gray-200">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'calculations' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('calculations')}
                >
                  The Calculations
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'defaults' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('defaults')}
                >
                  The Theological Defaults
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'figures' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('figures')}
                >
                  The Base Figures
                </button>
              </div>

              {/* Calculations Tab */}
              {activeTab === 'calculations' && (
                <div>
                  <div className="flex items-center mb-3">
                    <Calculator className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">The Calculations</h3>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-2 text-sm">
                    {getCalculationText().map((text, index) => (
                      <p key={index} className={index === getCalculationText().length - 1 ? "font-medium" : ""}>{text}</p>
                    ))}
                    
                    {includePurgatory && (
                      <div className="mt-4 text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
                        <p className="font-medium">* Purgatory note:</p>
                        <p>We assume very good Catholics and strong progress through purgatory. In our model, 85% of Catholic heaven-bound souls go to purgatory for 50 years; 15% go directly to heaven.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>The 85% is based on most people needing to pass through purgatory. There is no official Catholic teaching on what percentage of souls go to purgatory, but many theologians suggest that the majority of the saved are not perfectly purified at death and therefore require post-death cleansing. In fact, perhaps 15% having saintly perfection is too high of a figure!</li>
                          <li>The 50 years is more speculative and definitely frowned upon by the church, which discourages any fixed time estimates. Pope Benedict XVI explained, "It is clear that we cannot measure the duration of this transforming burning in terms of the chronological measurements of this world." However, since purgatory length depends on the soul's attachment to sin, before 1967, Catholic indulgences (basically, punishments for sin) were often labeled in terms of days or years — like 'a 300-day indulgence' — widely interpreted as time off in purgatory. Though the Church later clarified these were symbolic, the idea of purgatory lasting decades or hundreds of years stuck around in popular Catholic imagination. And since "God only knows" or "divine time" can't be plugged into an Earthly mathematical model, we chose 50 years.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Theological Defaults Tab */}
              {activeTab === 'defaults' && (
                <div>
                  <div className="flex items-center mb-3">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">The Theological Defaults</h3>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>Each religious tradition has its own teachings about who enters heaven — but not all are clear-cut, and many are debated within the tradition itself. For the sake of modeling, we made assumptions that reflect mainstream interpretations, historical trends, and scholarly consensus rather than edge-case or fringe beliefs.</p>
                    
                    <div>
                      <p className="font-medium text-foreground">💡 How We Chose the Defaults:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>When official doctrine exists, we used it.<br />
                        <span className="text-xs italic">Example: The Catholic Church teaches that baptism is necessary for salvation, so the default excludes unbaptized infants unless toggled on.</span></li>
                        
                        <li>When doctrine is ambiguous or pluralistic, we modeled the most common interpretation.<br />
                        <span className="text-xs italic">Example: Mainline Protestants vary widely, but tend to emphasize God's mercy — so the default is inclusive of nonbelievers.</span></li>
                        
                        <li>When no doctrine exists, we used contextual logic.<br />
                        <span className="text-xs italic">Example: Atheism assumes no afterlife, so the default population of heaven is zero.</span></li>
                        
                        <li>When traditions are inclusive, we honored that.<br />
                        <span className="text-xs italic">Example: Universalism includes everyone by default — toggles are hidden because they don't apply.</span></li>
                      </ul>
                    </div>
                    
                    <p>Each toggle in the Edge Cases section was shown or hidden depending on whether that question is relevant for the chosen doctrine. For hidden items, we still applied a default so the math stays complete — even if the user doesn't interact with that setting.</p>
                  </div>
                </div>
              )}

              {/* Base Figures Tab */}
              {activeTab === 'figures' && (
                <div>
                  <div className="flex items-center mb-3">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">The (Speculative) Base Figures</h3>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>The following figures underpin the model, and were generated by Perplexity AI, citing research on population trends and extrapolating from them where data was sparser, particularly: (1) to fill in dates pre-1900; (2) to separate out sub-religion data, e.g. Orthodox vs Reform Judaism; and (3) to forecast future populations. Extrapolation was done on a roughly linear basis, i.e. there was no assumption that religion would become exponentially more or less popular. Dog population data was also particularly challenging and therefore more speculative.</p>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deceased (Billion)</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Mortality Drivers</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">2025</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">100-105</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">Aging populations, chronic disease</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium">
                          <span>More notes on overall dog population</span>
                          <span className="transition group-open:rotate-180">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </summary>
                        <div className="text-xs pt-2 pb-1 pl-2 space-y-1">
                          <p>1. The earliest confirmed dog remains date back to 14,220 years ago in Germany (Bonn-Oberkassel dog). Early population spread was linked to hunting camps and agricultural societies.</p>
                          <p>2. Domestication Timeline: Mortality rates are tied to human population growth and urbanization.</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Pre-1900 numbers extrapolated from:
                              <ul className="list-[circle] pl-4 mt-1">
                                <li>Archaeological evidence of working dogs</li>
                                <li>Urbanization rates</li>
                                <li>Livestock practices</li>
                                <li>Tax records (e.g., medieval "dog tithes")</li>
                              </ul>
                            </li>
                            <li>Dog ratios: Comparative analysis of domestication studies vs. human growth</li>
                          </ul>
                          <p>3. Average Lifespan: Assumed average lifespan of ~12 years for dogs across history.</p>
                          <p>4. Mortality Rates:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Pre-modern societies: Higher mortality due to disease and lack of veterinary care.</li>
                            <li>Modern era: Increased pet populations and euthanasia rates contribute to higher totals.</li>
                          </ul>
                          <p>5. Dog Projections (2050 & 2100):</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Today, there are approximately 900 million dogs globally. Urbanization trends suggest larger pet populations but shorter lifespans due to health issues.</li>
                            <li>Euthanasia rates and stray dog populations also factor into mortality totals.</li>
                          </ul>
                        </div>
                      </details>
                      
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium">
                          <span>More notes on overall human population</span>
                          <span className="transition group-open:rotate-180">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </summary>
                        <div className="text-xs pt-2 pb-1 pl-2 space-y-1">
                          <p>1. Population Growth Rates: Historical population estimates were used to calculate cumulative deaths based on average life expectancy and mortality rates.</p>
                          <p>2. Pre-1900: Archaeological density models × regional population estimates</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>No systematic death records until 1850s</li>
                            <li>Pre-industrial societies had high infant mortality rates (~40% of childhood deaths).</li>
                            <li>Major pandemics (e.g., Black Death) reduced cumulative totals before 1700.</li>
                          </ul>
                          <p>3. Post-1900: Modern Data Sources: UN demographic data and census records were used for post-1900 estimates.</p>
                          <ul className="list-disc pl-5">
                            <li>108 billion total born (est. since 55,000 BCE) minus ~8.1 billion alive today = 100 million dead as of 2025</li>
                          </ul>
                          <p>4. Human Projections (2050 & 2100): Published projections and extrapolations</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Assumes continued population growth until mid-century followed by stabilization or decline in some regions.</li>
                            <li>Aging populations contribute to higher death rates.</li>
                          </ul>
                        </div>
                      </details>
                      
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-xs font-medium">
                          <span>More notes on religion-specific populations</span>
                          <span className="transition group-open:rotate-180">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </summary>
                        <div className="text-xs pt-2 pb-1 pl-2 space-y-1">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>No centralized records before 20th century</li>
                            <li>Religious estimates were therefore instead based on historical migration patterns and regional dominance patterns</li>
                            <li>These estimates should be treated as approximate ranges rather than precise counts, particularly for pre-20th century figures where records are fragmentary.</li>
                            <li>For sub-religions, assumed certain breakdowns:
                              <ul className="list-[circle] pl-4 mt-1">
                                <li>Christianity: 33% Catholic, 25% Orthodox, 42% Protestant pre-1900</li>
                                <li>Islam: 80% Sunni/20% Shia split maintained through history</li>
                                <li>Judaism: 90% Orthodox pre-1800, 60% post-WWII</li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default MethodologySection;