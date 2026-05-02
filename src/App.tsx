import { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Activity, Leaf, ShoppingCart, MessageCircle, Heart, Info, Send, User, LogOut } from 'lucide-react';
import { getPhase, getMeals, getWorkouts, getShoppingList, getSeedCycling, Location } from './lib/cycleData';
import AuthModal from './components/AuthModal';
import { getCurrentUser, saveCurrentUser, updateUserProfile, UserProfile } from './lib/auth';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const [day, setDay] = useState<number>(1);
  const [location, setLocation] = useState<Location>('Global');
  const [isPcos, setIsPcos] = useState<boolean>(false);
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hi! I am your PCOS Wellness Coach. Ask me about diet, cravings, or weight management.' },
  ]);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load current user on initial mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setDay(currentUser.day);
      setLocation(currentUser.location as Location);
      setIsPcos(currentUser.isPcos);
    }
  }, []);

  const handleDayChange = (newDay: number) => {
    setDay(newDay);
    if (user) {
      updateUserProfile({ day: newDay });
      setUser({ ...user, day: newDay });
    }
  };

  const handleLocationChange = (newLocation: Location) => {
    setLocation(newLocation);
    if (user) {
      updateUserProfile({ location: newLocation });
      setUser({ ...user, location: newLocation });
    }
  };

  const handlePcosToggle = () => {
    const newValue = !isPcos;
    setIsPcos(newValue);
    if (user) {
      updateUserProfile({ isPcos: newValue });
      setUser({ ...user, isPcos: newValue });
    }
  };

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const cycleData = getPhase(day);
  const meals = getMeals(cycleData.phase, location, isPcos);
  const workouts = getWorkouts(cycleData.phase, isPcos);
  const shoppingList = getShoppingList(cycleData.phase, location, isPcos);
  const seedCycling = getSeedCycling(day);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');

    setTimeout(() => {
      let botResponse = 'I am here to support you! Focus on balancing your blood sugar and getting good rest.';
      const msgLower = userMsg.toLowerCase();

      if (msgLower.includes('craving') || msgLower.includes('sugar')) {
        botResponse = 'Cravings are normal! Try pairing a complex carb with protein and healthy fats (like an apple with peanut butter) to stabilize blood sugar. Avoid eating naked carbs.';
      } else if (msgLower.includes('weight') || msgLower.includes('gain')) {
        botResponse = 'With PCOS, weight management is closely tied to insulin resistance. Focus on high-fiber vegetables, lean proteins, and stress management. Be gentle with yourself.';
      } else if (msgLower.includes('diet') || msgLower.includes('carb') || msgLower.includes('food')) {
        botResponse = 'A PCOS friendly diet focuses on low-glycemic foods. Think leafy greens, high-quality proteins, and healthy fats like avocado and seeds. Eat protein before your carbs!';
      } else if (msgLower.includes('tired') || msgLower.includes('energy') || msgLower.includes('fatigue')) {
        botResponse = 'Fatigue can be linked to hormone fluctuations and insulin. Make sure you are getting enough sleep, staying hydrated, and doing low-impact movement rather than high-stress HIIT.';
      }

      setChatHistory((prev) => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
    // Reset to defaults
    setDay(1);
    setLocation('Global');
    setIsPcos(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Cycle Sync Wellness</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 hidden sm:inline-block">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onSuccess={(u) => {
            setUser(u);
            setDay(u.day);
            setLocation(u.location as Location);
            setIsPcos(u.isPcos);
            setShowAuth(false);
          }}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        
        {/* Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Your Cycle
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Cycle Day ({day})</label>
                <input 
                  type="range" 
                  min="1" 
                  max="28" 
                  value={day} 
                  onChange={(e) => handleDayChange(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Day 1</span>
                  <span>Day 28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Location
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">Select Region</label>
              <select 
                value={location}
                onChange={(e) => handleLocationChange(e.target.value as Location)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="Global">Global / Unknown</option>
                <option value="East Africa">East Africa</option>
                <option value="West Africa">West Africa</option>
                <option value="Europe/USA">Europe / USA</option>
              </select>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg text-purple-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  PCOS Mode
                </h2>
                <p className="text-xs text-purple-700 mt-1">Optimize for insulin resistance</p>
              </div>
              <button 
                onClick={handlePcosToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPcos ? 'bg-purple-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPcos ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Phase Banner */}
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
              {cycleData.phase} Phase
            </span>
            <h2 className="text-2xl font-bold text-indigo-900 mb-2">{cycleData.description}</h2>
            {isPcos && (
              <p className="text-sm text-indigo-700 mt-2 bg-indigo-100/50 p-2 rounded-md inline-flex items-center gap-2">
                 <Info className="w-4 h-4" />
                 PCOS Mode is active. Focus on low-glycemic index foods and stress reduction.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Meals */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                Phase Meals ({location})
              </h3>
              <ul className="space-y-4">
                <li className="text-sm border-b pb-3 border-transparent">
                  <strong className="block text-slate-500 mb-1">Breakfast</strong>
                  <span className="text-slate-700">{meals.breakfast}</span>
                </li>
                <li className="text-sm border-b pb-3 border-transparent">
                  <strong className="block text-slate-500 mb-1">Lunch</strong>
                  <span className="text-slate-700">{meals.lunch}</span>
                </li>
                <li className="text-sm border-b pb-3 border-transparent">
                  <strong className="block text-slate-500 mb-1">Dinner</strong>
                  <span className="text-slate-700">{meals.dinner}</span>
                </li>
                <li className="text-sm">
                  <strong className="block text-slate-500 mb-1">Snack</strong>
                  <span className="text-slate-700">{meals.snack}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              {/* Workouts */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  <Activity className="w-5 h-5 text-rose-500" />
                  Recommended Movement
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                  {workouts.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Seed Cycling */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  <Leaf className="w-5 h-5 text-emerald-500" />
                  Seed Cycling
                </h3>
                <p className="text-sm text-slate-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  {seedCycling}
                </p>
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-800">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                Weekly Shopping List
              </h3>
              <div className="flex flex-wrap gap-2">
                {shoppingList.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* PCOS Chat Coach */}
            {isPcos && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[400px]">
                <div className="bg-purple-600 p-4 shrink-0">
                   <h3 className="font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    PCOS Wellness Coach
                  </h3>
                </div>
                <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white rounded-br-none' 
                          : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={endOfChatRef} />
                </div>
                <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about diet, cravings..." 
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
