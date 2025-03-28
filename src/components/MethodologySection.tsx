import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalculationResult, formatNumber, formatNumberToReadable } from "@/utils/calculationLogic";
import { Doctrine } from "@/data/doctrineData";
import { BookOpen, Info, Calculator, ChevronDown, ScrollText } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState('calculations');
  const [isExpanded, setIsExpanded] = useState(false);

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
  
  // Generate explanation text
  const getCalculationText = () => {
    let calculationText = [];
    
    // Extract the numbers from the explanations array
    const explanationLines = results.explanations;
    
    // Add each explanation line directly
    explanationLines.forEach(line => {
      if (line.trim()) {  // Only add non-empty lines
        if (line.startsWith('Total human souls')) {
          calculationText.push(<p key={line} className="font-bold">{line}</p>);
        } else {
          calculationText.push(line);
        }
      }
    });
    
    return calculationText;
  };

  const formatNumber = (num: number) => {
    return (num / 1_000_000_000).toFixed(2);
  };

  return (
    <section className="animate-fade-in space-y-2">
      <div className="glass-card animate-slide-down p-6 space-y-6">
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

        {/* Content */}
        <div className="content">
          {/* Calculations Tab */}
          {activeTab === 'calculations' && (
              <div>
                <div className="flex items-center mb-3">
                  <Calculator className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">The Calculations</h3>
                </div>
                <Separator className="mb-4" />
              <div className="space-y-2 text-sm">
                {getCalculationText().map((text, index) => {
                  if (typeof text === 'string' && text.startsWith('Total human souls')) {
                    return <p key={index} className="font-bold">{text}</p>;
                  }
                  return <p key={index}>{text}</p>;
                })}
                
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

                <div>
                  <h4 className="font-medium mb-2">Default Salvation Rates</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Inside religion: {selectedDoctrine.defaultInsideSavedPercentage}% of adherents</li>
                    <li>Outside religion: {selectedDoctrine.defaultOutsideSavedPercentage}% of non-adherents</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Edge Cases</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(selectedDoctrine.edgeCases).map(([key, value]) => (
                      <li key={key}>
                        {key === 'unbaptizedInfants' && 'Unbaptized Infants'}
                        {key === 'neverHeard' && 'People Who Never Heard'}
                        {key === 'otherMonotheists' && 'Other Monotheists'}
                        {key === 'atheistsPolytheists' && 'Atheists/Polytheists'}
                        {key === 'purgatory' && 'Purgatory'}
                        : {value ? 'Included' : 'Excluded'} by default
                      </li>
                    ))}
                  </ul>
                </div>
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
                <p>The following figures underpin the model (as the max number of deaths for each category), and were generated by Perplexity AI, citing research on population trends and extrapolating from them where data was sparser, particularly: 
                  <br></br>(1) to fill in dates pre-1900; 
                  <br></br>(2) to separate out sub-religion data, e.g. Orthodox vs Reform Judaism; and 
                  <br></br>(3) to forecast future populations. 
                  <br></br>Extrapolation was done on a roughly linear basis, i.e. there was no assumption that religion would become exponentially more or less popular. Dog population data was also particularly challenging and therefore more speculative.</p>
                <p> All figures in the tables below are in billions, so 1,200,000,000 is 1.2 billion.</p>
                
                <div className="space-y-6">
                  {/* Total Souls Table */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
                      <span>🔢 Table: Total Human and Dog Souls</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="pt-2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                              <th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humans</th>
                              <th scope="col" className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dogs</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.historicalData?.map((data) => (
                              <tr key={data.year}>
                                <td className="w-1/3 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{data.year}</td>
                                <td className="w-1/3 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.humans)}</td>
                                <td className="w-1/3 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.dogs)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>

                  {/* Christian Denominations Table */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
                      <span>🔢 Table: Christian Denominations</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="pt-2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                              <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catholics</th>
                              <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evangelicals</th>
                              <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prot. Mainliners</th>
                              <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chris. Orthodox</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.historicalData?.map((data) => (
                              <tr key={data.year}>
                                <td className="w-1/5 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{data.year}</td>
                                <td className="w-1/5 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.catholic)}</td>
                                <td className="w-1/5 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.protestant_evangelical)}</td>
                                <td className="w-1/5 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.protestant_mainline)}</td>
                                <td className="w-1/5 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.christian_orthodox)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>

                  {/* Other Religions Table */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
                      <span>🔢 Table: Other Religions</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="pt-2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sunni</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shia</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orthodox Jews</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reform Jews</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Universalists</th>
                              <th scope="col" className="w-1/7 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atheists</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.historicalData?.map((data) => (
                              <tr key={data.year}>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{data.year}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.muslim_sunni)}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.muslim_shia)}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.jew_orthodox)}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.jew_reform)}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.universalist)}</td>
                                <td className="w-1/7 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.atheists_polytheists)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>

                  {/* Edge Cases Table */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
                      <span>🔢 Table: Edge Cases</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </summary>
                    <div className="pt-2">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                              <th scope="col" className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unbaptized infants</th>
                              <th scope="col" className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Never heard of God</th>
                              <th scope="col" className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In purgatory</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {results.historicalData?.map((data) => (
                              <tr key={data.year}>
                                <td className="w-1/4 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{data.year}</td>
                                <td className="w-1/4 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.unbaptized_infants)}</td>
                                <td className="w-1/4 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.never_heard)}</td>
                                <td className="w-1/4 px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatNumber(data.in_purgatory)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
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
                    <p>5. Dog Projections:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Current global dog population and trends are based on available data.</li>
                      <li>Euthanasia rates and stray dog populations also factor into mortality totals.</li>
                    </ul>
                    <br></br>
                    <p><i>Examples of citations: [<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11579424/" className="text-primary hover:text-primary/80">Scientific Reports (NIH)</a>, 
                    <a href="https://worldanimalfoundation.org/advocate/dog-statistics/" className="text-primary hover:text-primary/80">World Animal Foundation</a>, 
                      <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9798575/" className="text-primary hover:text-primary/80">BMC Veterinary Research (NIH)</a>, 
                      <a href="https://www.avma.org/blog/pet-populations-are-way" className="text-primary hover:text-primary/80">American Veterinary Medical Association</a>, 
                      <a href="https://repository.up.ac.za/bitstream/handle/2263/46200/Akerele_Demographics_2015.pdf?sequence=1" className="text-primary hover:text-primary/80">University of Pretoria</a>, 
                      <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7116273/" className="text-primary hover:text-primary/80">Europe PubMed (NIH)</a>
                      <a href="https://wellbeingintl.org/dog-population-in-the-usa/" className="text-primary hover:text-primary/80">, Wellbeing International</a>, 
                      <a href="https://www.britannica.com/animal/dog" className="text-primary hover:text-primary/80">Britannica</a>, 
                      <a href="https://www.livescience.com/facts-about-dogs" className="text-primary hover:text-primary/80">Live Science]</a></i></p>
                  </div>
                </details>
                
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
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
                      <li>Pre-industrial societies had high infant mortality rates.</li>
                      <li>Major pandemics (e.g., Black Death) reduced cumulative totals before 1700.</li>
                    </ul>
                    <p>3. Post-1900: Modern Data Sources: UN demographic data and census records were used for post-1900 estimates.</p>
                    <p>4. Human Projections: Published projections and extrapolations</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Assumes continued population growth until mid-century followed by stabilization or decline in some regions.</li>
                      <li>Aging populations contribute to higher death rates.</li>
                    </ul>
                    <p> Further breakdown, over time, with mortality notes:</p>
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
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1700</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">5.5 - 6.5</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Plagues, infant mortality (40% childhood deaths)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1750</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">6.8 - 7.8</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Smallpox, malaria, famines</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1800</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">8.5 - 9.5</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Early industrialization health impacts</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1850</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">11 - 13</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">Cholera pandemics, colonial conflicts</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1900</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">16 - 18</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">TB/influenza, maternal mortality</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">1950</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">23 - 25</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">WWII, pre-antibiotic era</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">2000</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">48 - 52</td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">AIDS crisis, aging populations</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <br></br>
                    <p><i>Examples of citations: 
                    <a href="https://www.cdc.gov/nchs/data-visualization/mortality-trends/index.htm" className="text-primary hover:text-primary/80">CDC</a>, 
                    <a href="https://www.answers.com/sociology/How_many_people_have_died_in_the_history_of_the_world" className="text-primary hover:text-primary/80">Answers</a>, 
                    <a href="https://ourworldindata.org/population-growth-over-time" className="text-primary hover:text-primary/80">Our World in Data</a>, 
                    <a href="https://en.wikipedia.org/wiki/List_of_countries_by_population_in_1900" className="text-primary hover:text-primary/80">Wikipedia</a>, 
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1664601/" className="text-primary hover:text-primary/80">PloS Medicine</a>, 
                    <a href="https://www.pewresearch.org/short-read/2014/02/03/10-projections-for-the-global-population-in-2050/" className="text-primary hover:text-primary/80">Pew</a>, 
                    <a href="https://www.ined.fr/en/everything_about_population/demographic-facts-sheets/faq/how-many-people-since-the-first-humans/" className="text-primary hover:text-primary/80">Institut National D'etudes Demographiques</a>, 
                    <a href="https://www.prb.org/articles/how-many-people-have-ever-lived-on-earth/" className="text-primary hover:text-primary/80">Population Reference Bureau</a>, 
                    <a href="https://www.statista.com/statistics/997040/world-population-by-continent-1950-2020/" className="text-primary hover:text-primary/80">Statista</a>, 
                    <a href="https://www.weforum.org/press/2024/01/wef24-climate-crisis-health/" className="text-primary hover:text-primary/80">World Economic Forum (climate deaths)</a>, 
                    <a href="https://worldpopulationreview.com/countries/deaths-per-day" className="text-primary hover:text-primary/80">World Population Review</a>, 
                    <a href="https://www.weforum.org/stories/2021/12/population-boom-or-bust-global-earth-size-people/" className="text-primary hover:text-primary/80">World Economic Form (2100 pop)</a>
                    </i></p>
                  </div>
                </details>
                
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-primary hover:text-primary/80">
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
                        <ul className="list-disc pl-5 mt-1">
                          <li>Christianity: 33% Catholic, 25% Orthodox, 42% Protestant pre-1900</li>
                          <li>Islam: 80% Sunni/20% Shia split maintained through history</li>
                          <li>Judaism: 90% Orthodox pre-1800, 60% post-WWII</li>
                        </ul>
                      </li>
                    </ul>
                    <br></br>
                    <p><i>Examples of citations: On historical figures: 
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3035005/" className="text-primary hover:text-primary/80">J Sci Study Religion (NIH)</a>, 
                    <a href="https://www.metmuseum.org/essays/religion-and-culture-in-north-america-1600-1700" className="text-primary hover:text-primary/80">Met Museum</a>, 
                    <a href="https://www.loc.gov/exhibits/religion/rel02.html" className="text-primary hover:text-primary/80">Library of Congress</a>, 
                    <a href="https://www.khanacademy.org/humanities/ap-art-history/introduction-cultures-religions-apah/judaism-apah/a/jewish-history1750-to-ww-ii" className="text-primary hover:text-primary/80">Khan Academy</a>, 
                    <a href="https://en.wikipedia.org/wiki/Spread_of_Islam" className="text-primary hover:text-primary/80">Wikipedia (Islam)</a>, 
                    <a href="https://www.britannica.com/topic/Judaism/Modern-Judaism-c-1750-to-the-present" className="text-primary hover:text-primary/80">Britannica</a>, 
                    <a href="https://www.sikhnet.com/news/islamic-india-biggest-holocaust-world-history" className="text-primary hover:text-primary/80">Sikh Net</a>; 
                    General or present-day: 
                    <a href="https://www.pewresearch.org/religion/2009/10/07/mapping-the-global-muslim-population/" className="text-primary hover:text-primary/80">Pew (Muslim)</a>, 
                    <a href="https://www.britannica.com/story/what-is-the-most-widely-practiced-religion-in-the-world" className="text-primary hover:text-primary/80">Britannica</a>, 
                    <a href="https://www.pewresearch.org/religion/2021/09/21/population-growth-and-religious-composition/" className="text-primary hover:text-primary/80">Pew (India)</a>, 
                    <a href="http://Catholic.com" className="text-primary hover:text-primary/80">Catholic.com</a>, 
                    <a href="https://www.pewresearch.org/religion/2017/11/08/orthodox-christianity-in-the-21st-century/" className="text-primary hover:text-primary/80">Pew (Orthodox Christianity)</a>, 
                    <a href="https://www.pewresearch.org/short-reads/2015/05/18/mainline-protestants-make-up-shrinking-number-of-u-s-adults/" className="text-primary hover:text-primary/80">Pew (Mainline Protestant)</a>, 
                    <a href="https://www.cfr.org/article/sunni-shia-divide" className="text-primary hover:text-primary/80">Council on Foreign Relations</a>; 
                    Future projections: 
                    <a href="https://www.pewresearch.org/religion/2015/04/02/religious-projections-2010-2050/" className="text-primary hover:text-primary/80">Pew (world)</a>, 
                    <a href="https://www.pewresearch.org/religion/2022/09/13/projecting-u-s-religious-groups-population-shares-by-2070/" className="text-primary hover:text-primary/80">Pew (US)</a>, 
                    <a href="https://www.pewresearch.org/religion/2017/04/05/the-changing-global-religious-landscape/" className="text-primary hover:text-primary/80">Pew (world)</a>, 
                    <a href="https://www.pewresearch.org/religion/2022/12/21/key-findings-from-the-global-religious-futures-project/" className="text-primary hover:text-primary/80">Pew (world)</a>
                    </i></p>
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;