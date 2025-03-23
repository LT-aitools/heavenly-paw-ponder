
import { Doctrine, historicalData } from '../data/doctrineData';

export interface CalculationSettings {
  doctrine: Doctrine;
  allDogsGoToHeaven: boolean;
  dogGoodnessPercentage: number;
  insideSavedPercentage: number; 
  outsideSavedPercentage: number;
  edgeCases: Record<string, boolean>;
}

export interface CalculationResult {
  humanSouls: number;
  dogSouls: number;
  moreDogsOrHumans: 'dogs' | 'humans' | 'equal';
  explanations: string[];
}

// Format large numbers for display
export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)} billion`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)} million`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)} thousand`;
  }
  
  return num.toString();
};

// Main calculation function
export const calculateHeavenPopulation = (settings: CalculationSettings): CalculationResult => {
  const { doctrine, allDogsGoToHeaven, dogGoodnessPercentage, insideSavedPercentage, outsideSavedPercentage, edgeCases } = settings;
  const explanations: string[] = [];
  
  // For atheism, return zero population
  if (doctrine.id === 'atheism') {
    return {
      humanSouls: 0,
      dogSouls: 0,
      moreDogsOrHumans: 'equal',
      explanations: ['According to atheist belief, there is no heaven, so the population is zero.']
    };
  }

  // Calculate total human souls in heaven based on doctrine
  let humanSouls = 0;
  
  // Calculate souls from the religion's adherents
  const religionAdherents = getAdherentsForReligion(doctrine.id);
  let insideSaved = religionAdherents * (insideSavedPercentage / 100);
  explanations.push(`${formatNumber(religionAdherents)} adherents to ${doctrine.name} historically`);
  explanations.push(`${formatNumber(insideSaved)} saved (${insideSavedPercentage}% of adherents)`);
  
  // For universalism, everyone is saved
  if (doctrine.id === 'universalist') {
    humanSouls = historicalData.totalHumanDeaths;
    explanations.push(`All ${formatNumber(humanSouls)} human souls saved (Universalist doctrine)`);
  } else {
    // Everyone else - calculation depends on edge cases
    const nonAdherents = historicalData.totalHumanDeaths - religionAdherents;
    let outsideSaved = 0;
    
    if (edgeCases.unbaptizedInfants && doctrine.id === 'catholic') {
      const totalInfants = historicalData.totalHumanDeaths * historicalData.infantMortality.percentage;
      outsideSaved += totalInfants;
      explanations.push(`${formatNumber(totalInfants)} unbaptized infants saved`);
    }
    
    if (edgeCases.neverHeard) {
      const neverHeardPercentage = historicalData.awarenessPercentages[doctrine.id as keyof typeof historicalData.awarenessPercentages] || 0.7;
      const neverHeardPopulation = nonAdherents * neverHeardPercentage;
      const neverHeardSaved = neverHeardPopulation * (outsideSavedPercentage / 100);
      outsideSaved += neverHeardSaved;
      explanations.push(`${formatNumber(neverHeardSaved)} saved who never heard of ${doctrine.name} (${outsideSavedPercentage}% of ${formatNumber(neverHeardPopulation)})`);
    }
    
    if (edgeCases.otherMonotheists) {
      // Simplified - assumes about 20% of non-adherents are monotheists from other traditions
      const otherMonotheists = nonAdherents * 0.2;
      const monotheistsSaved = otherMonotheists * (outsideSavedPercentage / 100);
      outsideSaved += monotheistsSaved;
      explanations.push(`${formatNumber(monotheistsSaved)} other monotheists saved (${outsideSavedPercentage}% of ${formatNumber(otherMonotheists)})`);
    }
    
    if (edgeCases.atheistsPolytheists) {
      // Simplified - assumes about 30% of non-adherents are atheists or polytheists
      const atheistsPolytheists = nonAdherents * 0.3;
      const atheistsPolytheistsSaved = atheistsPolytheists * (outsideSavedPercentage / 100);
      outsideSaved += atheistsPolytheistsSaved;
      explanations.push(`${formatNumber(atheistsPolytheistsSaved)} atheists/polytheists saved (${outsideSavedPercentage}% of ${formatNumber(atheistsPolytheists)})`);
    }
    
    humanSouls = insideSaved + outsideSaved;
    
    // Apply purgatory logic for Catholics if enabled
    if (doctrine.id === 'catholic' && edgeCases.purgatory) {
      const purgatorySouls = humanSouls * 0.85; // 85% in purgatory
      humanSouls = humanSouls * 0.15; // Only 15% directly in heaven
      explanations.push(`85% of saved souls (${formatNumber(purgatorySouls)}) are in purgatory`);
      explanations.push(`Only ${formatNumber(humanSouls)} human souls currently in heaven (15% of total saved)`);
    } else {
      explanations.push(`Total human souls in heaven: ${formatNumber(humanSouls)}`);
    }
  }

  // Calculate dog souls
  let dogSouls = 0;
  if (allDogsGoToHeaven || doctrine.id === 'universalist') {
    dogSouls = historicalData.estimatedDogDeaths;
    explanations.push(`All ${formatNumber(dogSouls)} dogs go to heaven`);
  } else {
    dogSouls = historicalData.estimatedDogDeaths * (dogGoodnessPercentage / 100);
    explanations.push(`${formatNumber(dogSouls)} dogs in heaven (${dogGoodnessPercentage}% of all dogs are good)`);
  }

  // Determine if there are more dogs or humans
  let moreDogsOrHumans: 'dogs' | 'humans' | 'equal' = 'equal';
  if (dogSouls > humanSouls) {
    moreDogsOrHumans = 'dogs';
  } else if (humanSouls > dogSouls) {
    moreDogsOrHumans = 'humans';
  }

  return {
    humanSouls,
    dogSouls,
    moreDogsOrHumans,
    explanations
  };
};

// Helper function to estimate adherents for each religion throughout history
const getAdherentsForReligion = (religionId: string): number => {
  switch (religionId) {
    case 'catholic':
      return historicalData.populationByReligion.christianCatholic;
    case 'evangelical':
      return historicalData.populationByReligion.christianEvangelical;
    case 'mainlineProtestant':
      return historicalData.populationByReligion.christianMainline;
    case 'orthodoxChristian':
      return historicalData.populationByReligion.christianOrthodox;
    case 'muslim':
      return historicalData.populationByReligion.muslim;
    case 'judaismOrthodox':
    case 'judaismReform':
      return historicalData.populationByReligion.judaism / 2; // Split Judaism population
    case 'universalist':
      return historicalData.totalHumanDeaths; // All humans for universalist
    default:
      return 0;
  }
};
