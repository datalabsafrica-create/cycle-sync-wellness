import { useState } from 'react';
import { Calendar, MapPin, Activity, Leaf, ShoppingCart, Heart, Info, Sun, Lock, User, CheckCircle, ChevronRight, Share2, Mail } from 'lucide-react';
import { getPhase, getMeals, getWorkouts, getShoppingList, getSeedCycling, Location, UserMode, CycleType } from './lib/cycleData';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [mode, setMode] = useState<UserMode>('Cycle Sync');
  const [day, setDay] = useState<number>(1);
  const [cycleType, setCycleType] = useState<CycleType>('Regular');
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(1);
  const [postpartumWeeks, setPostpartumWeeks] = useState<number>(1);
  
  const [location, setLocation] = useState<Location>('Global');
  const [diet, setDiet] = useState<'Omnivore' | 'Vegetarian' | 'Vegan'>('Omnivore');
  const [age, setAge] = useState<number | ''>(28);
  const [goal, setGoal] = useState<string>('Hormone Balance');
  const [budget, setBudget] = useState<string>('Medium');
  const [activityLevel, setActivityLevel] = useState<string>('Moderate');
  const [workoutPref, setWorkoutPref] = useState<string>('Home');
  const [isPcos, setIsPcos] = useState<boolean>(false);
  
  const [showPayment, setShowPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'email' | null>(null);

  const isVegan = diet === 'Vegan';

  const cycleData = getPhase(day, mode, cycleType, pregnancyWeek);
  const meals = getMeals(cycleData.phase, location, isPcos, isVegan);
  const workouts = getWorkouts(cycleData.phase, isPcos);
  const shoppingList = getShoppingList(cycleData.phase, location, isPcos, isVegan);
  const seedCycling = getSeedCycling(day, mode, cycleType);

  const formatShareText = () => {
    let text = `My Personalized Wellness Plan (${mode} - ${cycleData.phase} Phase)\n\n`;
    text += `Phase Focus: ${cycleData.description}\n\n`;

    text += `*7-Day Meal Plan:*\n`;
    for(let i=0; i<7; i++) {
        text += `Day ${i+1}:\n`;
        text += `- Breakfast: ${meals.breakfast[i % meals.breakfast.length]}\n`;
        text += `- Lunch: ${meals.lunch[i % meals.lunch.length]}\n`;
        text += `- Dinner: ${meals.dinner[i % meals.dinner.length]}\n`;
        text += `- Snack: ${meals.snack[i % meals.snack.length]}\n\n`;
    }

    text += `*Workout Routine:*\n`;
    text += `Strategy:\n`;
    workouts.strategy.forEach(w => text += `- ${w}\n`);
    text += `\n7-Day Plan:\n`;
    workouts.daily.forEach((w, i) => text += `Day ${i+1}: ${w}\n`);
    text += `\n`;

    text += `*Wellness & Seed Cycling Tips:*\n`;
    text += `${seedCycling}\n`;

    return text;
  };

  const shareText = formatShareText();
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const emailLink = `mailto:?subject=${encodeURIComponent(`My Wellness Plan - ${cycleData.phase} Phase`)}&body=${encodeURIComponent(shareText)}`;

  const renderSideBar = () => (
    <div className="lg:col-span-4 space-y-6">
      
      {!hasPaid && (
        <div className="bg-gradient-to-br from-indigo-50 to-rose-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          <h2 className="font-semibold text-lg text-indigo-900 flex items-center gap-2 mb-2 relative z-10">
            <Lock className="w-5 h-5 text-indigo-600" />
            Premium Delivery
          </h2>
          <p className="text-sm text-indigo-700/80 mb-4 relative z-10">
            Unlock your full personalized weekly meal plan + shopping list delivered to your WhatsApp or Email for free.
          </p>
          <button 
            onClick={() => setShowPayment(true)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors relative z-10 flex items-center justify-center gap-2"
          >
            Unlock Now <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {hasPaid && (
         <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Plan Unlocked
              </h3>
              <button
                onClick={() => setHasPaid(false)}
                className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                Exit Premium
              </button>
            </div>
            <p className="text-sm text-emerald-800">
              Your 7-day personalized plan has been generated and queued for delivery via <strong>{deliveryMethod === 'whatsapp' ? 'WhatsApp' : 'Email'}</strong>.
            </p>
         </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          App Mode (Life Stage)
        </h2>
        <div className="space-y-4">
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value as UserMode)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="Cycle Sync">Cycle Sync Mode (Default)</option>
            <option value="Perimenopause">Perimenopause Mode</option>
            <option value="Menopause">Menopause Mode</option>
            <option value="Pregnancy">Pregnancy Mode</option>
            <option value="Postpartum">Postpartum Mode</option>
          </select>

          {mode === 'Cycle Sync' && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Cycle Day ({day})</label>
              <input 
                type="range" 
                min="1" 
                max={cycleType === 'Irregular - Long' ? 45 : 28} 
                value={day} 
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Day 1</span>
                <span>Day {cycleType === 'Irregular - Long' ? 45 : 28}</span>
              </div>
            </div>
          )}

          {mode === 'Pregnancy' && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Pregnancy Week ({pregnancyWeek})</label>
              <input 
                type="range" min="1" max="42" 
                value={pregnancyWeek} 
                onChange={(e) => setPregnancyWeek(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          )}

          {mode === 'Postpartum' && (
             <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Weeks Postpartum ({postpartumWeeks})</label>
              <input 
                type="range" min="1" max="52" 
                value={postpartumWeeks} 
                onChange={(e) => setPostpartumWeeks(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Personal Details
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
            <input 
              type="number" min="12" max="100" value={age} onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value as Location)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Global">Global / Unknown</option>
              <option value="East Africa">East Africa</option>
              <option value="West Africa">West Africa</option>
              <option value="Europe/USA">Europe / USA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Diet Type</label>
            <select 
              value={diet}
              onChange={(e) => setDiet(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Omnivore">Omnivore</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Goal</label>
             <select 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Hormone Balance">Hormone Balance</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Strength">Strength & Energy</option>
              <option value="Recovery">Healing & Recovery</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Budget</label>
             <select 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Low">Low - Affordable basics</option>
              <option value="Medium">Medium</option>
              <option value="High">High - Premium & Organic</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Activity</label>
               <select 
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Workout</label>
               <select 
                value={workoutPref}
                onChange={(e) => setWorkoutPref(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Home">Home</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-2">
             <input 
               type="checkbox" 
               id="pcos-toggle" 
               checked={isPcos} 
               onChange={(e) => setIsPcos(e.target.checked)} 
               className="w-4 h-4 accent-indigo-600 rounded text-indigo-600" 
             />
             <label htmlFor="pcos-toggle" className="text-sm font-medium text-slate-700 cursor-pointer">
               I have PCOS (Adjusts meals & workouts)
             </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Women's Wellness App</h1>
          </div>
          <div className="flex items-center gap-4">
            {!hasPaid ? (
               <button
                  onClick={() => setShowPayment(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all font-semibold"
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Unlock Weekly Plan</span>
                  <span className="sm:hidden">Unlock Plan</span>
                </button>
            ) : (
                <button
                  onClick={() => setHasPaid(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-all font-semibold"
                >
                  Exit Premium
                </button>
            )}
          </div>
        </div>
      </header>

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onSuccess={(method) => {
            setHasPaid(true);
            setDeliveryMethod(method);
            setShowPayment(false);
          }}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {renderSideBar()}

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Your Summary 
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{mode} Mode</span>
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Age: <b>{age}</b></span>
              <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Location: <b>{location}</b></span>
              <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Goal: <b>{goal}</b></span>
              <span className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Diet: <b>{diet}</b></span>
              {isPcos && <span className="text-sm text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 font-medium">PCOS Modifications Active</span>}
            </div>
            
            <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <h3 className="font-semibold text-indigo-900 mb-1 text-sm uppercase tracking-wider">{cycleData.phase} Phase</h3>
              <p className="text-indigo-800 leading-relaxed text-sm">{cycleData.description}</p>
            </div>
          </div>

          {!hasPaid ? (
            <>
              {/* FREE TIER PREVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    1-Day Meal Preview
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">Breakfast</span>
                      <p className="text-sm text-slate-700 mt-1">{meals.breakfast[0]}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">Lunch</span>
                      <p className="text-sm text-slate-700 mt-1">{meals.lunch[0]}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 backdrop-blur-[1px] flex items-end justify-center pb-2 z-10 rounded-xl">
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Lock className="w-3 h-3"/> Unlock full week</span>
                       </div>
                      <span className="text-xs font-bold text-slate-500 uppercase">Dinner</span>
                      <p className="text-sm text-slate-700 mt-1 blur-sm select-none">{meals.dinner[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Workout Preview
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                      <span className="text-xs font-bold text-amber-600 uppercase mb-2 block">Strategy</span>
                      <ul className="space-y-2">
                        {workouts.strategy.map((workout, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-slate-700">
                            <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{workout}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">Day 1 Focus</span>
                      <p className="text-sm text-slate-700 mt-1 font-medium">{workouts.daily[0]}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative">
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 backdrop-blur-[1px] flex items-end justify-center pb-2 z-10 rounded-xl">
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1"><Lock className="w-3 h-3"/> Unlock full weekly routine</span>
                       </div>
                      <span className="text-xs font-bold text-slate-500 uppercase">Day 2 Focus</span>
                      <p className="text-sm text-slate-700 mt-1 blur-sm select-none">{workouts.daily[1]}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 border border-rose-100 bg-rose-50/50 rounded-xl">
                      <h4 className="font-semibold text-rose-900 text-sm mb-1 flex items-center gap-1"><Info className="w-4 h-4"/> Wellness Insight</h4>
                      <p className="text-sm text-rose-800 leading-relaxed">{seedCycling}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-600 p-8 rounded-3xl text-white text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <Lock className="w-10 h-10 mx-auto text-white/80 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Want to see your full week?</h2>
                <p className="text-indigo-100 max-w-md mx-auto mb-6 text-sm">
                  Unlock your full personalized weekly meal plan + shopping list delivered directly to your WhatsApp or Email for free.
                </p>
                <button 
                  onClick={() => setShowPayment(true)}
                  className="px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Unlock 7-Day Plan - Free
                </button>
              </div>
            </>
          ) : (
             <>
               {/* PAID TIER */}
               <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-teal-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 className="font-semibold text-teal-900 flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                    Your Detailed Plan is Ready
                  </h3>
                  <p className="text-sm text-teal-800/80">
                    You can now share your setup instantly with yourself or loved ones.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-xl hover:bg-[#1ebd5a] transition-colors shadow-sm whitespace-nowrap">
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </a>
                  <a href={emailLink} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6">
                  <h3 className="font-bold text-xl text-slate-900 border-b pb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-indigo-500" />
                    Your 7-Day Meal Plan
                  </h3>
                  
                  <div className="space-y-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((d, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                         <h4 className="font-bold text-slate-800 mb-3 text-lg">Day {d}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <span className="text-xs font-bold text-indigo-500 uppercase block mb-1">Breakfast</span>
                               <p className="text-sm text-slate-700">{meals.breakfast[i % meals.breakfast.length]}</p>
                            </div>
                            <div>
                               <span className="text-xs font-bold text-emerald-500 uppercase block mb-1">Lunch</span>
                               <p className="text-sm text-slate-700">{meals.lunch[i % meals.lunch.length]}</p>
                            </div>
                            <div>
                               <span className="text-xs font-bold text-purple-500 uppercase block mb-1">Dinner</span>
                               <p className="text-sm text-slate-700">{meals.dinner[i % meals.dinner.length]}</p>
                            </div>
                            <div>
                               <span className="text-xs font-bold text-amber-500 uppercase block mb-1">Snack</span>
                               <p className="text-sm text-slate-700">{meals.snack[i % meals.snack.length]}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                      <ShoppingCart className="w-5 h-5 text-indigo-500" />
                      Weekly Grocery List
                    </h3>
                    <ul className="grid grid-cols-2 gap-y-3 gap-x-2">
                      {shoppingList.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700 items-start">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800 border-b pb-3">
                        <Activity className="w-5 h-5 text-amber-500" />
                        Full Workout Routine
                      </h3>
                      
                      <div className="mb-5">
                         <span className="text-xs font-bold text-amber-600 uppercase mb-2 block">General Strategy</span>
                         <ul className="space-y-2">
                           {workouts.strategy.map((workout, idx) => (
                             <li key={idx} className="flex gap-2 text-sm text-slate-700">
                               <div className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                               <span>{workout}</span>
                             </li>
                           ))}
                         </ul>
                      </div>

                      <div>
                         <span className="text-xs font-bold text-slate-500 uppercase mb-3 block">7-Day Plan</span>
                         <div className="space-y-3">
                           {workouts.daily.map((w, idx) => (
                              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="bg-white border border-slate-200 text-slate-600 font-bold text-xs w-12 h-12 flex flex-col items-center justify-center rounded-lg shrink-0">
                                   <span>Day</span>
                                   <span className="text-lg leading-none">{idx + 1}</span>
                                </div>
                                <div className="mt-1">
                                   <p className="text-sm font-medium text-slate-800">{w}</p>
                                </div>
                              </div>
                           ))}
                         </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-slate-800">
                        <Sparkles className="w-5 h-5 text-rose-500" />
                        Wellness Tips
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {seedCycling}
                      </p>
                    </div>
                  </div>
               </div>
             </>
          )}

        </div>
      </main>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
