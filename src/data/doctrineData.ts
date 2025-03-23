
export interface EdgeCase {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
  applicableTo: string[];
}

export interface Doctrine {
  id: string;
  name: string;
  description: string;
  defaultInsideSavedPercentage: number;
  defaultOutsideSavedPercentage: number;
  edgeCases: Record<string, boolean>;
  supportsPurgatory: boolean;
  includesAnimals: boolean;
}

// Edge cases that can be toggled
export const edgeCases: EdgeCase[] = [
  {
    id: 'unbaptizedInfants',
    label: 'Unbaptized Infants',
    description: 'Children who died before baptism',
    defaultValue: false,
    applicableTo: ['catholic'],
  },
  {
    id: 'neverHeard',
    label: 'People Who Never Heard Of the Religion',
    description: 'Those who lived without exposure to this religion',
    defaultValue: false,
    applicableTo: ['catholic', 'mainlineProtestant', 'orthodoxChristian', 'muslim', 'judaismOrthodox', 'judaismReform'],
  },
  {
    id: 'otherMonotheists',
    label: 'Other Monotheists with Good Morals',
    description: 'People of other monotheistic faiths who lived morally',
    defaultValue: false,
    applicableTo: ['catholic', 'mainlineProtestant', 'orthodoxChristian', 'muslim', 'judaismOrthodox', 'judaismReform'],
  },
  {
    id: 'atheistsPolytheists',
    label: 'Atheists / Polytheists with Good Morals',
    description: 'Non-believers or those of polytheistic faiths who lived morally',
    defaultValue: false, 
    applicableTo: ['catholic', 'mainlineProtestant', 'orthodoxChristian', 'muslim', 'judaismOrthodox', 'judaismReform'],
  },
  {
    id: 'purgatory',
    label: 'Those Still in Purgatory?',
    description: '85% of Catholic heaven-bound souls go to purgatory for 50 years; 15% go directly to heaven',
    defaultValue: true,
    applicableTo: ['catholic'],
  }
];

// Doctrine configurations
export const doctrines: Doctrine[] = [
  {
    id: 'catholic',
    name: 'Christianity (Catholic)',
    description: 'Roman Catholic theology on salvation and afterlife',
    defaultInsideSavedPercentage: 80,
    defaultOutsideSavedPercentage: 50,
    edgeCases: {
      unbaptizedInfants: false,
      neverHeard: false,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: true
    },
    supportsPurgatory: true,
    includesAnimals: false,
  },
  {
    id: 'evangelical',
    name: 'Christianity (Protestant – Evangelical)',
    description: 'Evangelical Protestant view of salvation through faith alone',
    defaultInsideSavedPercentage: 80,
    defaultOutsideSavedPercentage: 5,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: false,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'mainlineProtestant',
    name: 'Christianity (Protestant – Mainline)',
    description: 'Mainline Protestant theology with broader salvation possibilities',
    defaultInsideSavedPercentage: 85,
    defaultOutsideSavedPercentage: 60,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: true,
      otherMonotheists: true,
      atheistsPolytheists: true,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'orthodoxChristian',
    name: 'Christianity (Orthodox)',
    description: 'Eastern Orthodox understanding of salvation',
    defaultInsideSavedPercentage: 80,
    defaultOutsideSavedPercentage: 40,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: false,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'muslim',
    name: 'Islam (Sunni/Shia)',
    description: 'Islamic theology regarding paradise',
    defaultInsideSavedPercentage: 85,
    defaultOutsideSavedPercentage: 20,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: true,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'judaismOrthodox',
    name: 'Judaism (Orthodox)',
    description: 'Orthodox Jewish views on afterlife',
    defaultInsideSavedPercentage: 90,
    defaultOutsideSavedPercentage: 40,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: true,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'judaismReform',
    name: 'Judaism (Reform)',
    description: 'Reform Jewish perspective on afterlife',
    defaultInsideSavedPercentage: 95,
    defaultOutsideSavedPercentage: 80,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: true,
      otherMonotheists: true,
      atheistsPolytheists: true,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  },
  {
    id: 'universalist',
    name: 'Universalist',
    description: 'Universal salvation for all souls',
    defaultInsideSavedPercentage: 100,
    defaultOutsideSavedPercentage: 100,
    edgeCases: {
      unbaptizedInfants: true, // Hidden in UI but used in calculation
      neverHeard: true,
      otherMonotheists: true,
      atheistsPolytheists: true,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: true,
  },
  {
    id: 'atheism',
    name: 'Atheism',
    description: 'No afterlife (heaven population is zero)',
    defaultInsideSavedPercentage: 0,
    defaultOutsideSavedPercentage: 0,
    edgeCases: {
      unbaptizedInfants: false,
      neverHeard: false,
      otherMonotheists: false,
      atheistsPolytheists: false,
      purgatory: false
    },
    supportsPurgatory: false,
    includesAnimals: false,
  }
];

export const historicalData = {
  totalHumanDeaths: 109_000_000_000, // 109 billion humans have ever lived and died
  estimatedDogDeaths: 90_000_000_000, // 90 billion dogs estimate
  // Population by religious affiliation (rough estimates)
  populationByReligion: {
    christianCatholic: 18_000_000_000,
    christianEvangelical: 10_000_000_000,
    christianMainline: 9_000_000_000,
    christianOrthodox: 5_000_000_000,
    muslim: 20_000_000_000,
    judaism: 1_000_000_000,
    other: 46_000_000_000, // including atheists, polytheists, etc.
  },
  infantMortality: {
    percentage: 0.4, // 40% of all humans died in infancy historically
  },
  awarenessPercentages: {
    // % of people who had no knowledge of each religion
    catholic: 0.7, // 70% of humans never heard of Catholicism
    evangelical: 0.8,
    mainlineProtestant: 0.8,
    orthodoxChristian: 0.85,
    muslim: 0.7,
    judaismOrthodox: 0.9,
    judaismReform: 0.95,
  }
};

// Dogtrine options
export const dogtrines = [
  {
    id: 'allDogsGood',
    name: 'All Dogs Go To Heaven',
    description: 'Every dog automatically qualifies for heaven',
  },
  {
    id: 'someDogsGood',
    name: 'Some Dogs Go To Heaven',
    description: 'Only good dogs qualify for heaven',
  }
];
