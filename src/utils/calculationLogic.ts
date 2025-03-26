import { doctrines, Doctrine } from "@/data/doctrineData";
import { supabase, BaseFigures } from "@/lib/supabase";

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
  insideSavedPercentage?: number;
  outsideSavedPercentage?: number;
  edgeCases?: Record<string, boolean>;
}

// Function to fetch base figures from Supabase
export async function getBaseFigures(year: number): Promise<BaseFigures | null> {
  console.log('Fetching base figures for year:', year);
  console.log('Using Supabase URL:', import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL);
  
  try {
    // First try to get all rows to see if we can connect at all
    const testQuery = await supabase
      .from('base_figures')
      .select('year')
      .limit(1);
    
    console.log('Test query result:', testQuery);

    if (testQuery.error) {
      console.error('Test query failed:', testQuery.error);
      return null;
    }

    // Now try the actual query
    const { data, error } = await supabase
      .from('base_figures')
      .select('id, year, humans, dogs, unbaptized_infants, never_heard, monotheists, atheists_polytheists, in_purgatory, catholic, protestant_evangelical, protestant_mainline, christian_orthodox, jew_orthodox, jew_reform, muslim_sunni, muslim_shia, universalist')
      .eq('year', year)
      .maybeSingle();

    if (error) {
      console.error('Error fetching base figures:', {
        error,
        year,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    if (!data) {
      console.log('No data found for year:', year, 'Using default values');
      // Return default values if no data found
      return {
        id: 0,
        year: year,
        humans: 8000000000, // 8 billion default
        dogs: 900000000, // 900 million default
        unbaptized_infants: 100000000,
        never_heard: 1000000000,
        monotheists: 2000000000,
        atheists_polytheists: 1000000000,
        in_purgatory: 500000000,
        catholic: 1200000000,
        protestant_evangelical: 600000000,
        protestant_mainline: 400000000,
        christian_orthodox: 300000000,
        jew_orthodox: 15000000,
        jew_reform: 10000000,
        muslim_sunni: 1500000000,
        muslim_shia: 200000000,
        universalist: 50000000
      };
    }

    console.log('Successfully fetched data for year:', year, data);
    return data;
  } catch (e) {
    console.error('Unexpected error fetching base figures:', e);
    return null;
  }
}

export async function calculateHeavenPopulation(params: CalculationParams): Promise<CalculationResult> {
  const {
    doctrine,
    allDogsGoToHeaven,
    dogGoodnessPercentage,
    insideSavedPercentage,
    outsideSavedPercentage,
    edgeCases
  } = params;

  // Get base figures from Supabase for current year
  const currentYear = new Date().getFullYear();
  const baseFigures = await getBaseFigures(2025); // Using 2025 as our future projection point
  
  if (!baseFigures) {
    throw new Error('Could not fetch base figures from database');
  }

  // Calculate lifespan multipliers
  const humanLifespanMultiplier = doctrine.humanLifespanMultiplier;
  const dogLifespanMultiplier = doctrine.dogLifespanMultiplier;
  const averageLifespanHumans = 72;
  const averageLifespanDogs = 12;

  let humanSouls = 0;

  // 1. First calculate people in the religion who would be saved
  const worldPopulation = baseFigures.humans;
  const peopleInReligion = worldPopulation * (doctrine.percentageInsideDoctrine / 100);
  const soulsSavedInReligion = peopleInReligion * (insideSavedPercentage / 100) * humanLifespanMultiplier / averageLifespanHumans;
  humanSouls += soulsSavedInReligion;

  // 2. For Catholics only, add unbaptized babies and purgatory if selected
  if (doctrine.id === 'catholic') {
    if (edgeCases.unbaptizedInfants) {
      humanSouls += baseFigures.unbaptized_infants;
    }
    if (edgeCases.purgatory) {
      humanSouls += baseFigures.in_purgatory;
    }
  }

  // 3. For all religions, add other edge cases multiplied by outside-religion good percentage
  let outsideReligionSouls = 0;
  
  if (edgeCases.neverHeard) {
    outsideReligionSouls += baseFigures.never_heard;
  }
  if (edgeCases.otherMonotheists) {
    outsideReligionSouls += baseFigures.monotheists;
  }
  if (edgeCases.atheistsPolytheists) {
    outsideReligionSouls += baseFigures.atheists_polytheists;
  }

  // Apply outside religion percentage to the sum of all included outside groups
  humanSouls += (outsideReligionSouls * (outsideSavedPercentage / 100) * humanLifespanMultiplier / averageLifespanHumans);

  // Dog souls calculation
  let dogSouls = 0;
  if (allDogsGoToHeaven) {
    dogSouls = baseFigures.dogs;
  } else {
    dogSouls = baseFigures.dogs * (dogGoodnessPercentage / 100);
  }

  // Determine if there are more dogs or humans
  let moreDogsOrHumans: 'dogs' | 'humans' | 'equal' = 'equal';
  if (dogSouls > humanSouls) {
    moreDogsOrHumans = 'dogs';
  } else if (humanSouls > dogSouls) {
    moreDogsOrHumans = 'humans';
  }

  const explanations: string[] = [
    `Based on ${currentYear} world population of ${formatNumber(worldPopulation)} and dog population of ${formatNumber(baseFigures.dogs)}.`,
    `People in ${doctrine.name}: ${formatNumber(peopleInReligion)} (${doctrine.percentageInsideDoctrine}% of world population)`,
    `Souls saved within ${doctrine.name}: ${formatNumber(soulsSavedInReligion)} (${insideSavedPercentage}% of followers)`,
    `Outside religion souls considered: ${formatNumber(outsideReligionSouls)} (${outsideSavedPercentage}% saved)`,
    `Average human lifespan: ${averageLifespanHumans} years, average dog lifespan: ${averageLifespanDogs} years.`,
    `Human Lifespan Multiplier: ${humanLifespanMultiplier}, Dog Lifespan Multiplier: ${dogLifespanMultiplier}.`,
    `All dogs go to heaven: ${allDogsGoToHeaven}, dog goodness percentage: ${dogGoodnessPercentage}%.`
  ];

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
