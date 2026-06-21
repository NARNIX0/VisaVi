import React from 'react';
import { Sparkles, Heart, MessageSquare, X } from 'lucide-react';

export function ActionButtons() {
  const handleAction = (actionName: string) => {
    // Production-ready logging for debugging actions
    console.log(`ActionButtons: ${actionName} clicked.`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-8">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction('Reject')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          <X size={18} />
          Reject
        </button>
        
        <button
          onClick={() => handleAction('Save')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
        >
          <Heart size={18} />
          Save for later
        </button>

        <button
          onClick={() => handleAction('Outreach')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
        >
          <MessageSquare size={18} />
          Outreach
        </button>
      </div>

      <button
        onClick={() => handleAction('Apply')}
        className="flex flex-col items-center justify-center bg-emerald-900 hover:bg-emerald-950 text-white px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md min-w-[240px]"
      >
        <div className="flex items-center gap-2 font-bold text-lg">
          <Sparkles size={20} className="text-emerald-400" />
          One-Click Apply
        </div>
        <span className="text-xs text-emerald-300/80 font-normal">
          AI will generate your application
        </span>
      </button>
    </div>
  );
}