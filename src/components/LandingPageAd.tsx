import React, { useEffect } from 'react';

// ============================================================================
// 🛑 SOCIAL BAR SCRIPT CONFIGURATION 🛑
// React does not execute <script> tags that are directly returned in JSX or 
// dangerouslySetInnerHTML. For a Social Bar, you must load the script dynamically.
// ============================================================================

export default function LandingPageAd() {
  useEffect(() => {
    // ------------------------------------------------------------------------
    // OPTION 1: EXTERNAL SCRIPT (Most common)
    // If your Social Bar gives you a <script src="//..." /> tag, 
    // paste JUST the URL inside these quotes:
    // ------------------------------------------------------------------------
    const externalScriptUrl = ""; // e.g., "https://pl0000000.com/12/34/56.js"

    // ------------------------------------------------------------------------
    // OPTION 2: INLINE SCRIPT
    // If your Social Bar gives you raw javascript code (not a URL), 
    // paste it inside the backticks below:
    // ------------------------------------------------------------------------
    const inlineScript = `
      
    `;

    // --- INJECTION LOGIC ---
    let scriptElement: HTMLScriptElement | null = null;

    if (externalScriptUrl) {
      scriptElement = document.createElement('script');
      scriptElement.src = externalScriptUrl;
      scriptElement.async = true;
      document.body.appendChild(scriptElement);
    } else if (inlineScript.trim()) {
      scriptElement = document.createElement('script');
      scriptElement.innerHTML = inlineScript;
      document.body.appendChild(scriptElement);
    }

    return () => {
      // Cleanup when unmounted
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div className="w-full my-6 flex flex-col justify-center items-center bg-indigo-50/50 min-h-[100px] border border-indigo-100 border-dashed rounded-xl py-6 text-indigo-400 text-sm overflow-hidden">
      <span className="p-4 text-center">
        <strong className="block mb-1 text-indigo-600">Social Bar Ad Configuration</strong>
        Open <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded mr-1">src/components/LandingPageAd.tsx</code> 
        to paste your Ad Script.
      </span>
      {/* 
        If your ad ALSO gave you standard HTML <div> tags to place on the page, 
        you can uncomment the line below and paste them inside the backticks:
      */}
      {/* <div dangerouslySetInnerHTML={{ __html: `<div>HTML HERE</div>` }} /> */}
    </div>
  );
}
