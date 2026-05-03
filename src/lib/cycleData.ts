export type Phase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal' | 'Perimenopause' | 'Menopause';
export type Location = 'East Africa' | 'West Africa' | 'Europe/USA' | 'Global';
export type LifeStage = 'Menstruating' | 'Perimenopause' | 'Menopause';
export type CycleType = 'Regular' | 'Irregular - Long' | 'Irregular - Short' | 'Missing';

export interface CycleData {
  phase: Phase;
  description: string;
}

export function getPhase(day: number, lifeStage: LifeStage = 'Menstruating', cycleType: CycleType = 'Regular'): CycleData {
  if (lifeStage === 'Menopause') {
    return { phase: 'Menopause', description: 'Post-menopause focus. Prioritizing bone density, heart health, and hormone balance.' };
  } else if (lifeStage === 'Perimenopause') {
    return { phase: 'Perimenopause', description: 'Navigating hormonal changes. Focus on stabilizing estrogen/progesterone, mood, and sleep.' };
  }

  if (cycleType === 'Missing') {
    return { phase: 'Follicular', description: 'Amenorrhea/Missing Cycle: Focus on consistent nourishment, reducing stress, and syncing with lunar phases (New Moon = Menstrual, Full Moon = Ovulation) to encourage natural rhythm.' };
  }

  let phase: Phase;
  let description = '';

  if (day >= 1 && day <= 5) {
    phase = 'Menstrual';
    description = `Day ${day}: The shedding of the uterine lining. Energy is usually at its lowest.`;
  } else if (day >= 6 && day <= 13) {
    phase = 'Follicular';
    description = `Day ${day}: Estrogen and testosterone rise. Energy levels increase and mood typically improves.`;
  } else if (day >= 14 && day <= 16) {
    phase = 'Ovulation';
    description = `Day ${day}: An egg is released. Peak energy and communication skills.`;
  } else {
    phase = 'Luteal';
    description = `Day ${day}: Progesterone rises. Energy winds down, preparing for the next cycle.`;
  }

  if (cycleType === 'Irregular - Long' && day > 16) {
    description += ' Note: For long cycles, your Follicular phase (pre-ovulation) may be extended. Pay attention to ovulation signs (like cervical mucus changes).';
  } else if (cycleType === 'Irregular - Short' && day > 16) {
    description += ' Note: Short cycles often mean a shorter Luteal phase. Focus on foods and habits that support progesterone.';
  }

  return { phase, description };
}

export function getSeedCycling(day: number, lifeStage: LifeStage = 'Menstruating', cycleType: CycleType = 'Regular'): string {
  if (lifeStage === 'Menopause' || lifeStage === 'Perimenopause') {
    return 'For perimenopause and menopause, you can sync with the lunar cycle (Flax/Pumpkin from New to Full Moon, Sesame/Sunflower from Full to New Moon), or simply enjoy 1-2 tbsp of a mix daily for general hormone and bone support.';
  }

  if (cycleType === 'Missing') {
    return 'With a missing cycle, try seed cycling with the moon: Flax/Pumpkin seeds from New Moon to Full Moon, then switch to Sesame/Sunflower seeds from Full Moon to New Moon.';
  }

  if (day >= 1 && day <= 14) {
    return 'Flax seeds & Pumpkin seeds (1-2 tbsp each daily). Helps balance estrogen.';
  } else {
    return 'Sesame seeds & Sunflower seeds (1-2 tbsp each daily). Helps stimulate progesterone.';
  }
}

const foodDatabase: Record<Location, {carbs: string[], veganProteins: string[], animalProteins: string[], fats: string[], veggies: string[], fruits: string[]}> = {
  'East Africa': {
    carbs: ['Matooke', 'Millet', 'Posho (maize flour)', 'Sweet potatoes', 'Cassava'],
    veganProteins: ['Beans', 'Groundnuts', 'Lentils', 'Peas'],
    animalProteins: ['Tilapia', 'Eggs', 'Chicken', 'Beef'],
    fats: ['Avocado', 'Groundnut paste', 'Coconut oil'],
    veggies: ['Sukuma wiki', 'Dodo (amaranth leaves)', 'Tomatoes', 'Cabbage'],
    fruits: ['Bananas', 'Mangoes', 'Papaya']
  },
  'West Africa': {
    carbs: ['Yam', 'Plantain', 'Rice', 'Cassava', 'Fufu'],
    veganProteins: ['Beans', 'Egusi', 'Bambara nuts', 'Lentils'],
    animalProteins: ['Fish', 'Chicken', 'Goat meat', 'Eggs'],
    fats: ['Red palm oil', 'Avocado', 'Groundnuts'],
    veggies: ['Spinach', 'Okra', 'Bitter leaf', 'Tomatoes'],
    fruits: ['Mangoes', 'Oranges', 'Pineapple']
  },
  'Europe/USA': {
    carbs: ['Oats', 'Brown rice', 'Quinoa', 'Sweet potatoes', 'Whole wheat bread'],
    veganProteins: ['Tofu', 'Lentils', 'Beans', 'Tempeh'],
    animalProteins: ['Chicken', 'Eggs', 'Yogurt', 'Salmon'],
    fats: ['Avocado', 'Olive oil', 'Almonds', 'Walnuts'],
    veggies: ['Spinach', 'Kale', 'Broccoli', 'Bell peppers'],
    fruits: ['Berries', 'Apples', 'Bananas']
  },
  'Global': {
    carbs: ['Oats', 'Rice', 'Potatoes', 'Pasta'],
    veganProteins: ['Beans', 'Lentils', 'Tofu', 'Chickpeas'],
    animalProteins: ['Eggs', 'Chicken', 'Fish', 'Yogurt'],
    fats: ['Nuts', 'Seeds', 'Avocado', 'Oil'],
    veggies: ['Mixed vegetables', 'Greens', 'Carrots'],
    fruits: ['Apples', 'Bananas', 'Oranges']
  }
};

export interface MealsOptions {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snack: string[];
}

export function getMeals(phase: Phase, location: Location, isPcos: boolean, isVegan: boolean = false): MealsOptions {
  const foods = foodDatabase[location];
  const proteins = isVegan ? foods.veganProteins : [foods.animalProteins[0], foods.veganProteins[0], foods.animalProteins[1] || foods.animalProteins[0], foods.veganProteins[1] || foods.veganProteins[0], foods.animalProteins[2] || foods.animalProteins[0]];
  
  let meals: MealsOptions = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

  const getCarb = (isPcos: boolean) => isPcos ? foods.carbs.filter(c => !['Posho (maize flour)', 'Rice', 'White bread', 'Pasta', 'Fufu'].includes(c)).slice(0, 2).join(' or ') : foods.carbs[0];

  switch (phase) {
    case 'Menstrual':
      meals.breakfast = [
        `Warm ${getCarb(isPcos)} porridge or bowl with ${foods.fruits[0]} + Iron-rich ${proteins[0]}.`,
        `Comforting ${foods.carbs[1]} toast/bowl with ${foods.fats[0]} and a side of ${proteins[1] || proteins[0]}.`,
        `Smoothie with ${foods.fruits[1]}, ${foods.veggies[0]}, and a handful of ${foods.fats[1] || foods.fats[0]}.`
      ];
      meals.lunch = [
        `Nourishing stew with ${proteins[2] || proteins[0]}, ${foods.veggies[0]}, and a small portion of ${foods.carbs[1]}.`,
        `Warm soup: ${foods.veggies[1]} and ${proteins[0]} with a side of ${foods.carbs[0]}.`,
        `Light bowl with roasted ${foods.veggies[0]}, ${proteins[1] || proteins[0]}, and ${foods.fats[0]}.`
      ];
      meals.dinner = [
        `Warm soup or curry with ${foods.veggies[1]}, ${proteins[1] || proteins[0]}.`,
        `Slow-cooked ${proteins[0]} with ${foods.veggies[0]} over minimal ${foods.carbs[0]}.`,
        `Comforting ${foods.carbs[1]} mash with rich ${proteins[2] || proteins[0]} and steamed ${foods.veggies[0]}.`
      ];
      meals.snack = [
        `${foods.fruits[2] || foods.fruits[0]} with a handful of ${foods.fats[0]}.`,
        `Small handful of ${foods.fats[1] || foods.fats[0]}.`,
        `Warm herbal tea with a piece of ${foods.fruits[0]}.`
      ];
      break;
    case 'Follicular':
      meals.breakfast = [
        `Energizing ${proteins[1] || proteins[0]} with ${foods.veggies[0]} and ${foods.carbs[0]}.`,
        `Fresh ${foods.fruits[0]} and ${proteins[0]} balance bowl.`,
        `Light ${getCarb(isPcos)} with ${proteins[2] || proteins[0]} and a splash of ${foods.fats[0]}.`
      ];
      meals.lunch = [
        `Fresh salad or light bowl with ${foods.carbs[1]}, lean ${proteins[0]}, and ${foods.veggies[1]}.`,
        `Vibrant ${foods.veggies[0]} stir-fry with ${proteins[1] || proteins[0]} and ${foods.fats[1] || foods.fats[0]}.`,
        `${foods.carbs[0]} with a hearty serving of ${foods.veggies[0]} and ${proteins[0]}.`
      ];
      meals.dinner = [
        `Stir-fry or light stew using ${proteins[2] || proteins[0]} and plenty of ${foods.veggies[0]}.`,
        `Lean ${proteins[0]} pan-seared with ${foods.veggies[1]} and a little ${foods.carbs[1]}.`,
        `Baked ${proteins[1] || proteins[0]} with roasted ${foods.veggies[0]}.`
      ];
      meals.snack = [
        `Fresh ${foods.fruits[1]} with ${foods.fats[1] || foods.fats[0]}.`,
        `${foods.fruits[0]} slices.`,
        `Mixed seeds (${foods.fats[0]}) and ${foods.fruits[2] || foods.fruits[0]}.`
      ];
      break;
    case 'Ovulation':
      meals.breakfast = [
        `Light ${foods.fruits[0]} smoothie or fruit bowl with ${foods.fats[0]}.`,
        `Refreshing ${foods.veggies[0]} and ${foods.fruits[1]} juice with a side of ${proteins[0]}.`,
        `${proteins[1] || proteins[0]} accompanied by light ${foods.fruits[0]}.`
      ];
      meals.lunch = [
        `Raw or lightly cooked ${foods.veggies[0]} salad with ${proteins[1] || proteins[0]}.`,
        `Cooling cucumber and ${foods.veggies[1]} bowl with ${proteins[0]} and ${foods.fats[0]}.`,
        `Light ${foods.carbs[1]} pasta/salad tossed with ${proteins[2] || proteins[0]} and greens.`
      ];
      meals.dinner = [
        `Light bowl/plate featuring ${foods.veggies[1]}, ${proteins[0]}, minimal ${foods.carbs[0]}.`,
        `Grilled ${proteins[1] || proteins[0]} with a large portion of ${foods.veggies[0]}.`,
        `Refreshing soup with ${foods.veggies[0]} and ${proteins[0]}.`
      ];
      meals.snack = [
        `Fresh ${foods.fruits[2]} slices or handful of raw nuts.`,
        `A small piece of ${foods.fruits[0]}.`,
        `Handful of ${foods.fats[0]}.`
      ];
      break;
    case 'Luteal':
      meals.breakfast = [
        `Warming ${getCarb(isPcos)} with ${foods.fats[0]} to stabilize blood sugar.`,
        `Savory ${proteins[0]} bowl with cooked ${foods.veggies[0]} and ${foods.fats[1] || foods.fats[0]}.`,
        `Hearty ${foods.carbs[1]} porridge topped with ${foods.fruits[0]} and ${foods.fats[0]}.`
      ];
      meals.lunch = [
        `Grounding meal: ${foods.carbs[1]} with roasted/cooked ${foods.veggies[0]} and ${proteins[0]}.`,
        `Rich stew with ${proteins[1] || proteins[0]}, ${foods.veggies[1]}, and root ${foods.carbs[0]}.`,
        `Baked ${foods.carbs[0]} stuffed with ${proteins[0]} and topped with ${foods.fats[0]}.`
      ];
      meals.dinner = [
        `Comforting stew/bake with ${foods.carbs[0]}, ${foods.veggies[1]}, and rich ${proteins[1] || proteins[0]}.`,
        `Warm ${proteins[2] || proteins[0]} curry with ${foods.veggies[0]} and minimal ${foods.carbs[1]}.`,
        `Slow-roasted ${proteins[0]} and root ${foods.veggies[0]} medley.`
      ];
      meals.snack = [
        `${foods.fruits[0]} baked with cinnamon or ${foods.fats[0]}.`,
        `Dark chocolate (if available) or small portion of ${foods.fats[1] || foods.fats[0]}.`,
        `Warm ${foods.fruits[1]} compote.`
      ];
      break;
    case 'Perimenopause':
      meals.breakfast = [
        `Calcium-rich morning: ${getCarb(isPcos)} with ${foods.fats[0]} and a side of ${proteins[2] || proteins[0]}.`,
        `High-protein start: ${proteins[0]} with cooked ${foods.veggies[0]} and half a portion of ${foods.carbs[0]}.`,
        `Phyto-boost: Smoothie with ${foods.fruits[0]}, ${foods.veggies[1]}, and ${foods.fats[0]}.`
      ];
      meals.lunch = [
        `Phytoestrogen focus: ${foods.carbs[1]} with ${proteins[0]}, plenty of ${foods.veggies[0]}, and healthy fats.`,
        `Cooling salad: ${foods.veggies[1]} base, ${proteins[1] || proteins[0]}, and ${foods.fats[0]} dressing.`,
        `Balanced plate: Lean ${proteins[0]}, large serving of ${foods.veggies[0]}, and minimal ${foods.carbs[0]}.`
      ];
      meals.dinner = [
        `Mood & sleep support: Light stew with ${foods.carbs[0]}, magnesium-rich ${foods.veggies[1]}, and lean ${proteins[1] || proteins[0]}.`,
        `Omega-rich: ${proteins[2] || proteins[0]} baked with ${foods.veggies[0]} and ${foods.fats[0]}.`,
        `Comforting & light: Warm ${foods.veggies[0]} soup with a side of ${proteins[0]}.`
      ];
      meals.snack = [
        `Hydrating ${foods.fruits[1]} with cooling ${foods.fats[1] || foods.fats[0]}.`,
        `${foods.fruits[0]} with a sprinkle of seeds (${foods.fats[0]}).`,
        `Small handful of ${foods.fats[0]} to stabilize mood.`
      ];
      break;
    case 'Menopause':
      meals.breakfast = [
        `Heart-healthy start: ${getCarb(isPcos)} topped with ${proteins[1] || proteins[0]} and ${foods.fruits[0]}.`,
        `Bone-support bowl: ${proteins[0]} and ${foods.veggies[0]} with a drizzle of ${foods.fats[0]}.`,
        `Light & fiber-rich: ${foods.fruits[1]} with ${proteins[2] || proteins[0]} and ${foods.fats[1] || foods.fats[0]}.`
      ];
      meals.lunch = [
        `Bone density bowl: ${foods.carbs[1]} with high-quality ${proteins[0]}, ${foods.veggies[0]}, and olive/coconut oil.`,
        `Protein-focused salad: Mixed ${foods.veggies[0]} and ${foods.veggies[1]} with ${proteins[1] || proteins[0]}.`,
        `Hearty stew: Minimal ${foods.carbs[0]} with abundant ${foods.veggies[0]} and ${proteins[0]}.`
      ];
      meals.dinner = [
        `Lean & green: Generous portion of ${foods.veggies[1]} with ${proteins[2] || proteins[0]} and minimal ${foods.carbs[0]}.`,
        `Omega focus: ${foods.fats[0]} seasoned ${proteins[0]} with roasted ${foods.veggies[0]}.`,
        `Light digestive bowl: Cooked ${foods.veggies[0]} and ${proteins[1] || proteins[0]}.`
      ];
      meals.snack = [
        `Handful of mixed nuts/seeds (${foods.fats[0]}) with ${foods.fruits[2] || foods.fruits[0]}.`,
        `Calcium boost: Small serving of ${proteins[2] || proteins[0]} or ${foods.fats[1] || foods.fats[0]}.`,
        `Fresh ${foods.fruits[0]} to support hydration.`
      ];
      break;
  }
  
  if (isPcos) {
      meals.breakfast = meals.breakfast.map(m => m + ` *ensure high protein to stabilize insulin*.`);
  }

  return meals;
}

export function getWorkouts(phase: Phase, isPcos: boolean): string[] {
  let workouts = [];
  
  if (isPcos) {
      workouts.push('Aim for low-impact consistency to avoid cortisol spikes.');
  }

  switch (phase) {
    case 'Menstrual':
      workouts.push('Rest, Light Yoga, Slow Walking, Stretching.');
      break;
    case 'Follicular':
      workouts.push('Strength Training, Running, Dance, Higher energy movement.');
      if (isPcos) workouts.push('Slow-weighted strength training is excellent.');
      break;
    case 'Ovulation':
      workouts.push('HIIT, Spin class, Group fitness, High energy output.');
      if (isPcos) workouts.push('Keep HIIT under 30 minutes to manage cortisol.');
      break;
    case 'Luteal':
      workouts.push('Pilates, Yoga, Swimming, Walking, Lower intensity strength.');
      break;
    case 'Perimenopause':
      workouts.push('Strength training for bone density (2-3x a week).');
      workouts.push('Restorative Yoga to manage stress and cortisol.');
      workouts.push('Walking or light cardio to support cardiovascular health.');
      break;
    case 'Menopause':
      workouts.push('Weight-bearing exercises for preserving bone density.');
      workouts.push('Mobility and balance work to maintain joint health.');
      workouts.push('Consistent low-to-moderate impact cardio (walking, swimming).');
      break;
  }
  
  return workouts;
}

export function getShoppingList(phase: Phase, location: Location, isPcos: boolean, isVegan: boolean = false): string[] {
  const foods = foodDatabase[location];
  const proteins = isVegan ? foods.veganProteins : [foods.animalProteins[0], foods.veganProteins[0], foods.animalProteins[1] || foods.animalProteins[0]];

  let list = [
    ...foods.veggies.slice(0, 2),
    ...proteins.slice(0, 2),
    ...foods.fats.slice(0, 2),
  ];
  
  if (!isPcos) {
      list.push(...foods.carbs.slice(0, 2));
      list.push(...foods.fruits.slice(0, 2));
  } else {
      list.push(foods.carbs[0]); // Less carbs
      list.push(foods.fruits[0]); // Less sugar
      list.push('Extra Green Veggies');
  }

  if (phase === 'Menstrual' || phase === 'Follicular') {
      list.push('Flax seeds', 'Pumpkin seeds');
  } else if (phase === 'Luteal' || phase === 'Ovulation') {
      list.push('Sesame seeds', 'Sunflower seeds');
  } else {
      list.push('Mixed seeds (Flax, Pumpkin, Sesame, Sunflower)');
      list.push('Calcium-rich leafy greens');
  }

  return [...new Set(list)]; // unique items
}
