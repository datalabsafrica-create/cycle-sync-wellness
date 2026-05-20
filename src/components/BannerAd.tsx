import React from 'react';

export default function BannerAd() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : '59fcefaf3187ccccbe23ab851c523e16',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script src="https://www.highperformanceformat.com/59fcefaf3187ccccbe23ab851c523e16/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex justify-center items-center my-6">
      <iframe 
        srcDoc={adHtml}
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        title="Advertisement"
        className="rounded-lg bg-slate-50 border border-slate-100 shadow-sm"
      />
    </div>
  );
}
