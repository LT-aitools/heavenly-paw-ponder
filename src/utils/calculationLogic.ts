import { doctrines, Doctrine } from "@/data/doctrineData";

interface CalculationParams {
  doctrine: Doctrine;
  allDogsGoToHeaven: boolean;
  dogGoodnessPercentage: number;
  insideSavedPercentage: number;
  outsideSavedPercentage: number;
  edgeCases: Record<string, boolean>;
}

// Modify the CalculationResult interface to include source data
export interface CalculationResult {
  humanSouls: number;
  dogSouls: number;
  moreDogsOrHumans: 'dogs' | 'humans' | 'equal';
  explanations: string[];
  // Add additional fields for the results page
  doctrine?: Doctrine;
  allDogsGoToHeaven?: boolean;
  dogGoodnessPercentage?: number;
}

const currentYear = new Date().getFullYear();

// Data sources
const worldPopulation = 8000000000;
const dogPopulation = 900000000;
const averageLifespanHumans = 72;
const averageLifespanDogs = 12;

export function calculateHeavenPopulation(params: CalculationParams): CalculationResult {
  const {
    doctrine,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCases
  } = params;

  // Lifespan multiplier based on doctrine
  const humanLifespanMultiplier = doctrine.humanLifespanMultiplier;
  const dogLifespanMultiplier = doctrine.dogLifespanMultiplier;

  // People inside vs outside the doctrine
  const percentageInsideDoctrine = doctrine.percentageInsideDoctrine;
  const percentageOutsideDoctrine = 100 - percentageInsideDoctrine;

  // Calculate souls saved inside and outside the doctrine
  const soulsSavedInsideDoctrine = (worldPopulation * (percentageInsideDoctrine / 100)) * (insideSavedPercentage / 100) * humanLifespanMultiplier / averageLifespanHumans;
  const soulsSavedOutsideDoctrine = (worldPopulation * (percentageOutsideDoctrine / 100)) * (outsideSavedPercentage / 100) * humanLifespanMultiplier / averageLifespanHumans;
  let humanSouls = soulsSavedInsideDoctrine + soulsSavedOutsideDoctrine;

  // Dog souls calculation
  let dogSouls = 0;
  if (allDogsGoToHeaven) {
    dogSouls = dogPopulation * dogLifespanMultiplier / averageLifespanDogs;
  } else {
    dogSouls = (dogPopulation * (dogGoodnessPercentage / 100)) * dogLifespanMultiplier / averageLifespanDogs;
  }

  // Adjustments for edge cases
  if (edgeCases.babiesDontCount) {
    humanSouls *= 0.8; // Assume babies make up 20% of the population
  }
  if (edgeCases.disabledDontCount) {
    humanSouls *= 0.9; // Assume disabled people make up 10% of the population
  }
  if (edgeCases.onlyGoodCount) {
    humanSouls *= 0.5; // Assume only 50% of people are "good"
  }

  // Determine if there are more dogs or humans
  let moreDogsOrHumans: string = 'equal';
  if (dogSouls > humanSouls) {
    moreDogsOrHumans = 'dogs';
  } else if (humanSouls > dogSouls) {
    moreDogsOrHumans = 'humans';
  }

  const explanations: string[] = [
    `Based on current world population of ${formatNumber(worldPopulation)} and dog population of ${formatNumber(dogPopulation)}.`,
    `Average human lifespan: ${averageLifespanHumans} years, average dog lifespan: ${averageLifespanDogs} years.`,
    `Souls saved inside doctrine: ${formatNumber(soulsSavedInsideDoctrine)}, souls saved outside doctrine: ${formatNumber(soulsSavedOutsideDoctrine)}.`,
    `Doctrine: ${doctrine.name}, Human Lifespan Multiplier: ${humanLifespanMultiplier}, Dog Lifespan Multiplier: ${dogLifespanMultiplier}.`,
    `Percentage inside doctrine: ${percentageInsideDoctrine}%, inside saved percentage: ${insideSavedPercentage}%, outside saved percentage: ${outsideSavedPercentage}%.`,
    `All dogs go to heaven: ${allDogsGoToHeaven}, dog goodness percentage: ${dogGoodnessPercentage}%.`
  ];

  // Add additional fields to the result
  const result: CalculationResult = {
    humanSouls,
    dogSouls,
    moreDogsOrHumans: moreDogsOrHumans as 'dogs' | 'humans' | 'equal',
    explanations,
    doctrine: params.doctrine,
    allDogsGoToHeaven: params.allDogsGoToHeaven,
    dogGoodnessPercentage: params.dogGoodnessPercentage
  };

  return result;
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat().format(Math.round(number));
};
