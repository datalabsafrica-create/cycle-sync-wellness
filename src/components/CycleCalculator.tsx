import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';

export default function CycleCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState<number>(28);

  const calculateNextPeriod = () => {
    if (!lastPeriodDate) return null;
    
    const date = new Date(lastPeriodDate);
    // add cycleLength days
    date.setDate(date.getDate() + cycleLength);
    
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const nextPeriod = calculateNextPeriod();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 mt-6">
      <h3 className="font-bold text-xl text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-rose-500" />
        Menstrual Cycle Calculator
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First day of last period
            </label>
            <input 
              type="date" 
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-slate-700 bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Average cycle length (days)
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="range" 
                min="21" 
                max="35" 
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <span className="text-sm font-bold w-12 text-center bg-rose-50 text-rose-700 py-1 rounded-lg">
                {cycleLength}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Typical cycle lengths are 21-35 days.</p>
          </div>
        </div>
        
        <div className="h-full flex flex-col justify-center">
          {nextPeriod ? (
            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 flex flex-col items-center text-center">
              <Clock className="w-8 h-8 text-rose-500 mb-2" />
              <p className="text-sm text-rose-800 font-medium mb-1">Your next period is expected on:</p>
              <h4 className="text-xl sm:text-2xl font-bold text-rose-950">{nextPeriod}</h4>
              <p className="text-xs text-rose-700/80 mt-2">
                This is an estimate based on your <b>{cycleLength}-day</b> cycle.
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60 border-dashed flex flex-col items-center text-center justify-center h-full text-slate-400">
              <CalendarIcon className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm">Select the start date of your last period to calculate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
