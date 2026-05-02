export type Phase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
export type Location = 'East Africa' | 'West Africa' | 'Europe/USA' | 'Global';

export interface CycleData {
  phase: Phase;
  description: string;
}

export function getPhase(day: number): CycleData {
  if (day >= 1 && day <= 5) {
    return { phase: 'Menstrual', description: 'Days 1-5: The shedding of the uterine lining. Energy is usually at its lowest.' };
  } else if (day >= 6 && day <= 13) {
    return { phase: 'Follicular', description: 'Days 6-13: Estrogen and testosterone rise. Energy levels increase and mood typically improves.' };
  } else if (day >= 14 && day <= 16) {
    return { phase: 'Ovulation', description: 'Days 14-16: An egg is released. Peak energy and communication skills.' };
  } else {
    return { phase: 'Luteal', description: 'Days 17-28: Progesterone rises. Energy winds down, preparing for the next cycle.' };
  }
}

export function getSeedCycling(day: number): string {
  if (day >= 1 && day <= 14) {
    return 'Flax seeds & Pumpkin seeds (1-2 tbsp each daily). Helps balance estrogen.';
  } else {
    return 'Sesame seeds & Sunflower seeds (1-2 tbsp each daily). Helps stimulate progesterone.';
  }
}

const foodDatabase: Record<Location, Record<string, string[]>> = {
  'East Africa': {
    carbs: ['Matooke', 'Millet', 'Posho (maize flour)', 'Sweet potatoes', 'Cassava'],
    proteins: ['Beans', 'Groundnuts', 'Tilapia', 'Eggs', 'Chicken'],
    fats: ['Avocado', 'Groundnut paste', 'Coconut oil'],
    veggies: ['Sukuma wiki', 'Dodo (amaranth leaves)', 'Tomatoes', 'Cabbage'],
    fruits: ['Bananas', 'Mangoes', 'Papaya']
  },
  'West Africa': {
    carbs: ['Yam', 'Plantain', 'Rice', 'Cassava', 'Fufu'],
    proteins: ['Beans', 'Egusi', 'Fish', 'Chicken', 'Goat meat'],
    fats: ['Red palm oil', 'Avocado', 'Groundnuts'],
    veggies: ['Spinach', 'Okra', 'Bitter leaf', 'Tomatoes'],
    fruits: ['Mangoes', 'Oranges', 'Pineapple']
  },
  'Europe/USA': {
    carbs: ['Oats', 'Brown rice', 'Quinoa', 'Sweet potatoes', 'Whole wheat bread'],
    proteins: ['Chicken', 'Eggs', 'Yogurt', 'Salmon', 'Tofu'],
    fats: ['Avocado', 'Olive oil', 'Almonds', 'Walnuts'],
    veggies: ['Spinach', 'Kale', 'Broccoli', 'Bell peppers'],
    fruits: ['Berries', 'Apples', 'Bananas']
  },
  'Global': {
    carbs: ['Oats', 'Rice', 'Potatoes', 'Pasta'],
    proteins: ['Eggs', 'Beans', 'Lentils', 'Chicken'],
    fats: ['Nuts', 'Seeds', 'Avocado', 'Oil'],
    veggies: ['Mixed vegetables', 'Greens', 'Carrots'],
    fruits: ['Apples', 'Bananas', 'Oranges']
  }
};

export function getMeals(phase: Phase, location: Location, isPcos: boolean) {
  const foods = foodDatabase[location];
  
  let meals = {
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: ''
  };

  const getCarb = (isPcos: boolean) => isPcos ? foods.carbs.filter(c => !['Posho (maize flour)', 'Rice', 'White bread', 'Pasta', 'Fufu'].includes(c)).slice(0, 2).join(' or ') : foods.carbs[0];
  const lowGIMessage = isPcos ? ' (Low GI/High Fiber focus)' : '';

  switch (phase) {
    case 'Menstrual':
      meals.breakfast = `Warm ${getCarb(isPcos)} porridge or bowl with ${foods.fruits[0]} + Iron-rich ${foods.proteins[0]}.`;
      meals.lunch = `Nourishing stew with ${foods.proteins[2] || foods.proteins[0]}, ${foods.veggies[0]}, and a small portion of ${foods.carbs[1]}.`;
      meals.dinner = `Warm soup or curry with ${foods.veggies[1]}, ${foods.proteins[1] || foods.proteins[0]}.`;
      meals.snack = `${foods.fruits[2] || foods.fruits[0]} with a handful of ${foods.fats[0]}.`;
      break;
    case 'Follicular':
      meals.breakfast = `Energizing ${foods.proteins[1] || foods.proteins[0]} with ${foods.veggies[0]} and ${foods.carbs[0]}.`;
      meals.lunch = `Fresh salad or light bowl with ${foods.carbs[1]}, lean ${foods.proteins[0]}, and ${foods.veggies[1]}.`;
      meals.dinner = `Stir-fry or light stew using ${foods.proteins[2] || foods.proteins[0]} and plenty of ${foods.veggies[0]}.`;
      meals.snack = `Fresh ${foods.fruits[1]} with ${foods.fats[1] || foods.fats[0]}.`;
      break;
    case 'Ovulation':
      meals.breakfast = `Light ${foods.fruits[0]} smoothie or fruit bowl with ${foods.fats[0]}.`;
      meals.lunch = `Raw or lightly cooked ${foods.veggies[0]} salad with ${foods.proteins[1] || foods.proteins[0]}.`;
      meals.dinner = `Light bowl/plate featuring ${foods.veggies[1]}, ${foods.proteins[0]}, minimal ${foods.carbs[0]}.`;
      meals.snack = `Fresh ${foods.fruits[2]} slices or handful of raw nuts.`;
      break;
    case 'Luteal':
      meals.breakfast = `Warming ${getCarb(isPcos)} with ${foods.fats[0]} to stabilize blood sugar.`;
      meals.lunch = `Grounding meal: ${foods.carbs[1]} with roasted/cooked ${foods.veggies[0]} and ${foods.proteins[0]}.`;
      meals.dinner = `Comforting stew/bake with ${foods.carbs[0]}, ${foods.veggies[1]}, and rich ${foods.proteins[1] || foods.proteins[0]}.`;
      meals.snack = `${foods.fruits[0]} baked with cinnamon or ${foods.fats[0]}.`;
      break;
  }
  
  if (isPcos) {
      meals.breakfast += ` *ensure high protein to stabilize insulin*.`;
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
  }
  
  return workouts;
}

export function getShoppingList(phase: Phase, location: Location, isPcos: boolean): string[] {
  const foods = foodDatabase[location];
  let list = [
    ...foods.veggies.slice(0, 2),
    ...foods.proteins.slice(0, 2),
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
  } else {
      list.push('Sesame seeds', 'Sunflower seeds');
  }

  return [...new Set(list)]; // unique items
}
