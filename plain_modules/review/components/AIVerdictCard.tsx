import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { AIVerdict, SkillAlignment } from '@/types/job';
import { CircularProgress } from './CircularProgress';

interface AIVerdictCardProps {
  verdict: AIVerdict;
}

function SkillProgressBar({ skill }: { skill: SkillAlignment }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-slate-700 font-medium">{skill.name}</span>
        <span className="text-slate-500">{skill.percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${skill.percentage}%` }}
          role="progressbar"
          aria-valuenow={skill.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export function AIVerdictCard({ verdict }: AIVerdictCardProps) {
  if (!verdict) {
    throw new Error("AIVerdictCard: verdict prop is required for rendering match analysis.");
  }

  if (!verdict.skillsAlignment || !Array.isArray(verdict.skillsAlignment)) {
    throw new Error("AIVerdictCard: skillsAlignment data is missing or invalid.");
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI Verdict</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600">{verdict.verdictText}</span>
            <span className="text-slate-400 text-lg">/ {verdict.matchPercentage}% match</span>
          </div>
        </div>
        <CircularProgress value={verdict.matchPercentage} />
      </div>

      {/* Chance Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-600">Interview Chance</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900">{verdict.interviewChance}%</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-600">Offer Chance</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900">{verdict.offerChance}%</span>
        </div>
      </div>

      {/* Skills Match Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Skills Match</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {verdict.skillsAlignment.map((skill) => (
              <SkillProgressBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>

        <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View all requirements
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}