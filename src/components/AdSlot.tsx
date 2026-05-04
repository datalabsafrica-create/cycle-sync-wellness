import { useEffect, useRef } from 'react';

interface AdSlotProps {
  zoneId?: string;
  className?: string;
  format?: 'banner' | 'rectangle';
}

export default function AdSlot({ zoneId = 'default_zone', className = '', format = 'banner' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent duplicate script injection, especially useful in React StrictMode
    if (containerRef.current && containerRef.current.querySelector('script')) {
      return;
    }

    const script = document.createElement('script');
    // Placeholder for actual PropellerAds or advertising network script
    // E.g., src="//js.monu.delivery/adv.js" or similar
    script.src = `https://ad-network-placeholder.com/deliver.js?zone=${zoneId}`;
    script.async = true;
    script.dataset.cfasync = "false";
    
    script.onerror = () => {
      if (containerRef.current) {
         // Show a subtle fallback if ad blockers block the script or it fails to load
         const fallback = document.createElement('span');
         fallback.className = 'text-xs text-slate-400 italic';
         fallback.innerText = 'Sponsored Space';
         containerRef.current.appendChild(fallback);
      }
    };

    if (containerRef.current) {
        containerRef.current.appendChild(script);
    }
  }, [zoneId]);

  return (
    <div className={`mt-6 mb-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-4 overflow-hidden ${className}`}>
      <div className="w-full flex flex-col items-center justify-center text-center">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 block">Advertisement</span>
        <div 
            ref={containerRef} 
            className={`w-full flex items-center justify-center ${format === 'banner' ? 'min-h-[90px]' : 'min-h-[250px]'}`}
        >
             {/* External Ad script will be injected here safely without blocking React render */}
        </div>
      </div>
    </div>
  );
}
