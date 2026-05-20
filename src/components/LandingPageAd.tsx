import React, { useEffect } from 'react';

// ============================================================================
// 🛑 SOCIAL BAR / SMARTLINK SCRIPT CONFIGURATION 🛑
// React does not execute <script> tags that are directly returned in JSX or 
// dangerouslySetInnerHTML. For a Social Bar or Smartlink script, you must load the script dynamically.
// ============================================================================

export default function LandingPageAd() {
  useEffect(() => {
    // ------------------------------------------------------------------------
    // OPTION 1: EXTERNAL SCRIPT (Most common for Social Bar & Smartlink)
    // If your provider gives you a <script src="//..." /> tag, 
    // paste JUST the URL inside these quotes:
    // ------------------------------------------------------------------------
    const externalScriptUrl = "https://pl29460722.effectivecpmnetwork.com/99/65/35/996535d24626d362c1b6d671dc143056.js"; // e.g., "https://pl0000000.com/12/34/56.js"

    // ------------------------------------------------------------------------
    // OPTION 2: INLINE SCRIPT
    // If your provider gives you raw javascript code (not a URL), 
    // paste it inside the backticks below:
    // ------------------------------------------------------------------------
    const inlineScript = `
      
    `;

    // ------------------------------------------------------------------------
    // OPTION 3: DIRECT SMARTLINK (URL)
    // If you just have a direct smartlink URL and want users to click it,
    // put the URL here, and it will be rendered as a button below!
    // ------------------------------------------------------------------------
    const smartlinkUrl = "https://www.effectivecpmnetwork.com/eptfdgegw?key=9029ed441555986ae5243084e752e0d5"; // e.g., "https://www.profitablecpmrate.com/..."

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

  // For Option 3: Direct smartlink usage
  const smartlinkUrl = "https://www.effectivecpmnetwork.com/eptfdgegw?key=9029ed441555986ae5243084e752e0d5"; // If you are using option 3, paste URL here too to make the prompt go away

  return (
    <div className="w-full my-6 flex flex-col justify-center items-center bg-transparent min-h-[50px] py-6 text-indigo-400 text-sm overflow-hidden">
      {!smartlinkUrl && (
        <span className="p-4 text-center bg-indigo-50/50 border border-indigo-100 border-dashed rounded-xl w-full">
          <strong className="block mb-1 text-indigo-600">Ad / Smartlink Configuration</strong>
          Open <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded mr-1">src/components/LandingPageAd.tsx</code> 
          to paste your Ad Script.
        </span>
      )}
      
      {smartlinkUrl && (
        <a 
          href={smartlinkUrl}
          target="_blank" 
          rel="noreferrer noopener"
          className="mt-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Special Offer
        </a>
      )}

      {/* 
        If your ad ALSO gave you standard HTML <div> tags to place on the page,  
        you can uncomment the line below and paste them inside the backticks:
      */}
      {/* <div dangerouslySetInnerHTML={{ __html: `<div>HTML HERE</div>` }} /> */}
    </div>
  );
}
