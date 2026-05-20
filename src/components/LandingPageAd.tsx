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
    const smartlinkUrl = ""; // e.g., "https://www.profitablecpmrate.com/..."

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
  const smartlinkUrl = ""; // If you are using option 3, paste URL here too to make the prompt go away

  return (
    <div className="w-full h-0">
      {smartlinkUrl && (
        <div className="flex flex-col items-center text-center my-6 py-6 bg-transparent">
          <a 
            href={smartlinkUrl}
            target="_blank" 
            rel="noreferrer noopener"
            className="mt-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-base tracking-wide"
          >
            Unlock Premium Access
          </a>
          <p className="text-xs text-indigo-400 mt-3 max-w-xs">
            Note: If the ad or link does not appear, your browser's Adblocker or tracking protection might be blocking it. 
            Also, some scripts require opening the app in a new tab to work properly outside of the editor preview.
          </p>
        </div>
      )}
    </div>
  );
}
