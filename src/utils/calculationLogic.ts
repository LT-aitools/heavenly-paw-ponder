import { doctrines, Doctrine, historicalData } from "@/data/doctrineData";
import { supabase, BaseFigures } from "@/lib/supabase";

interface CalculationParams {
  currentYear: number;
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
  insideSavedPercentage?: number;
  outsideSavedPercentage?: number;
  edgeCases?: Record<string, boolean>;
  historicalData?: {
    year: string;
    humanSouls: number;
    dogSouls: number;
    catholic: number;
    protestant_evangelical: number;
    protestant_mainline: number;
    christian_orthodox: number;
    jew_orthodox: number;
    jew_reform: number;
    muslim_sunni: number;
    muslim_shia: number;
    universalist: number;
    atheists_polytheists: number;
    unbaptized_infants: number;
    never_heard: number;
    in_purgatory: number;
  }[];
}

// Function to fetch base figures from Supabase
export async function getBaseFigures(year: number): Promise<BaseFigures> {
  try {
    const { data, error } = await supabase
      .from('base_figures')
      .select('id, year, humans, dogs, unbaptized_infants, never_heard, monotheists, atheists_polytheists, in_purgatory, catholic, protestant_evangelical, protestant_mainline, christian_orthodox, jew_orthodox, jew_reform, muslim_sunni, muslim_shia, universalist')
      .eq('year', year)
      .single();

    if (error) {
      console.error('Error fetching base figures:', error);
      throw new Error(`Failed to fetch data for year ${year}: ${error.message}`);
    }

    if (!data) {
      throw new Error(`No data found for year ${year}. Please ensure the database has entries for this year.`);
    }

    return data;
  } catch (error) {
    console.error('Error in getBaseFigures:', error);
    throw error;
  }
}

export async function calculateSoulsInHeaven(params: CalculationParams): Promise<CalculationResult> {
  const {
    currentYear,
    doctrine,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCases
  } = params;

  console.log('Calculation Parameters:', {
    currentYear,
    doctrineId: doctrine.id,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCases
  });

  // Get base figures from Supabase - no fallback
  const baseFigures = await getBaseFigures(currentYear);
  console.log('Base Figures from Supabase:', baseFigures);

  let humanSouls = 0;
  const explanations: string[] = [];

  // 1. First calculate people in the religion who would be saved
  let peopleInReligion = 0;
  
  // Use the correct column based on doctrine
  switch (doctrine.id) {
    case 'catholic':
      peopleInReligion = baseFigures.catholic;
      break;
    case 'protestant_evangelical':
      peopleInReligion = baseFigures.protestant_evangelical;
      break;
    case 'protestant_mainline':
      peopleInReligion = baseFigures.protestant_mainline;
      break;
    case 'christian_orthodox':
      peopleInReligion = baseFigures.christian_orthodox;
      break;
    case 'jew_orthodox':
      peopleInReligion = baseFigures.jew_orthodox;
      break;
    case 'jew_reform':
      peopleInReligion = baseFigures.jew_reform;
      break;
    case 'muslim_sunni':
      peopleInReligion = baseFigures.muslim_sunni;
      break;
    case 'muslim_shia':
      peopleInReligion = baseFigures.muslim_shia;
      break;
    case 'universalist':
      peopleInReligion = baseFigures.universalist;
      break;
    case 'atheism':
      // For atheism, we'll count atheists/polytheists as "in religion"
      peopleInReligion = baseFigures.atheists_polytheists;
      break;
    default:
      throw new Error(`Unknown doctrine: ${doctrine.id}`);
  }

  console.log('People in religion calculation:', {
    doctrine: doctrine.id,
    peopleInReligion,
    insideSavedPercentage,
  });

  const soulsSavedInReligion = peopleInReligion * (insideSavedPercentage / 100);
  humanSouls += soulsSavedInReligion;

  console.log('Souls saved in religion:', {
    soulsSavedInReligion,
    humanSoulsTotal: humanSouls
  });

  // Add the main religion calculation to explanations
  explanations.push(`${doctrine.name}: ${formatNumber(peopleInReligion)} × ${insideSavedPercentage}% "Good" = ${formatNumber(soulsSavedInReligion)}`);

  // 2. For Catholics only, add unbaptized babies and purgatory if selected
  if (doctrine.id === 'catholic') {
    if (edgeCases.unbaptizedInfants) {
      humanSouls += baseFigures.unbaptized_infants;
      console.log('Adding unbaptized infants:', baseFigures.unbaptized_infants);
      explanations.push(`Unbaptized infants: ${formatNumber(baseFigures.unbaptized_infants)}`);
    }
    if (edgeCases.purgatory) {
      humanSouls += baseFigures.in_purgatory;
      console.log('Adding souls in purgatory:', baseFigures.in_purgatory);
      explanations.push(`Souls in Purgatory: ${formatNumber(baseFigures.in_purgatory)}`);
    }
  }

  // 3. For all religions, add other edge cases multiplied by outside-religion good percentage
  let outsideReligionSouls = 0;
  
  // Calculate edge cases only if they're enabled
  if (edgeCases.neverHeard) {
    const neverHeardSouls = baseFigures.never_heard * (outsideSavedPercentage / 100);
    outsideReligionSouls += neverHeardSouls;
    console.log('Never heard calculation:', {
      baseNumber: baseFigures.never_heard,
      percentage: outsideSavedPercentage,
      result: neverHeardSouls
    });
    explanations.push(`People who never heard of the religion (included): ${formatNumber(baseFigures.never_heard)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(neverHeardSouls)}`);
  }
  if (edgeCases.otherMonotheists) {
    const otherMonotheistSouls = baseFigures.monotheists * (outsideSavedPercentage / 100);
    outsideReligionSouls += otherMonotheistSouls;
    console.log('Other monotheists calculation:', {
      baseNumber: baseFigures.monotheists,
      percentage: outsideSavedPercentage,
      result: otherMonotheistSouls
    });
    explanations.push(`Other monotheists (included): ${formatNumber(baseFigures.monotheists)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(otherMonotheistSouls)}`);
  }
  if (edgeCases.atheistsPolytheists) {
    const atheistPolytheistSouls = baseFigures.atheists_polytheists * (outsideSavedPercentage / 100);
    outsideReligionSouls += atheistPolytheistSouls;
    console.log('Atheists/Polytheists calculation:', {
      baseNumber: baseFigures.atheists_polytheists,
      percentage: outsideSavedPercentage,
      result: atheistPolytheistSouls
    });
    explanations.push(`Atheists or Polytheists (everyone else) (included): ${formatNumber(baseFigures.atheists_polytheists)} × ${outsideSavedPercentage}% "Good" = ${formatNumber(atheistPolytheistSouls)}`);
  }

  humanSouls += outsideReligionSouls;
  console.log('Final human souls calculation:', {
    outsideReligionSouls,
    totalHumanSouls: humanSouls
  });

  // Add total humans before dogs
  explanations.push(`Total human souls = ${formatNumberToReadable(humanSouls)}`);

  // Dog souls calculation
  let dogSouls = 0;
  if (allDogsGoToHeaven) {
    dogSouls = baseFigures.dogs;
    console.log('Dog souls (all go to heaven):', dogSouls);
    explanations.push(`\nDogs: ${formatNumber(baseFigures.dogs)} (All dogs go to heaven) = ${formatNumberToReadable(dogSouls)}`);
  } else {
    dogSouls = baseFigures.dogs * (dogGoodnessPercentage / 100);
    console.log('Dog souls calculation:', {
      baseDogs: baseFigures.dogs,
      percentage: dogGoodnessPercentage,
      result: dogSouls
    });
    explanations.push(`\nDogs: ${formatNumber(baseFigures.dogs)} × ${dogGoodnessPercentage}% "Good" = ${formatNumberToReadable(dogSouls)}`);
  }

  // Determine if there are more dogs or humans
  let moreDogsOrHumans: 'dogs' | 'humans' | 'equal' = 'equal';
  if (dogSouls > humanSouls) {
    moreDogsOrHumans = 'dogs';
  } else if (humanSouls > dogSouls) {
    moreDogsOrHumans = 'humans';
  }

  console.log('Final calculation results:', {
    humanSouls,
    dogSouls,
    moreDogsOrHumans
  });

  const result: CalculationResult = {
    humanSouls,
    dogSouls,
    moreDogsOrHumans,
    explanations,
    doctrine: params.doctrine,
    allDogsGoToHeaven: params.allDogsGoToHeaven,
    dogGoodnessPercentage: params.dogGoodnessPercentage,
    insideSavedPercentage: params.insideSavedPercentage,
    outsideSavedPercentage: params.outsideSavedPercentage,
    edgeCases: params.edgeCases
  };

  return result;
}

export const formatNumber = (number: number): string => {
  try {
    return new Intl.NumberFormat().format(Math.round(number));
  } catch (e) {
    console.error('Error formatting number:', number, e);
    return number.toString();
  }
};

export const formatNumberToReadable = (num: number): string => {
  try {
    if (num >= 1000000000000) {
      return `${(num / 1000000000000).toFixed(1)} trillion`;
    } else if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)} billion`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} million`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)} thousand`;
    } else {
      return num.toString();
    }
  } catch (e) {
    console.error('Error formatting number:', num, e);
    return num.toString();
  }
};

export async function calculateHistoricalData(params: CalculationParams): Promise<{ year: string; humanSouls: number; dogSouls: number; }[]> {
  const years = ['1750', '1800', '1850', '1900', '1950', '2000', '2025', '2050', '2100'];
  const historicalResults = [];

  for (const year of years) {
    const yearParams = {
      ...params,
      currentYear: parseInt(year)
    };

    try {
      const yearResult = await calculateSoulsInHeaven(yearParams);
      historicalResults.push({
        year,
        humanSouls: yearResult.humanSouls,
        dogSouls: yearResult.dogSouls
      });
    } catch (error) {
      console.error(`Error calculating data for year ${year}:`, error);
      // If we can't get data for a year, skip it
      continue;
    }
  }

  return historicalResults;
}
