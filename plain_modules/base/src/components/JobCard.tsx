import { Job } from "@/types";
import { Building2, MapPin, Wallet } from "lucide-react";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <Building2 size={16} />
            <span className="text-sm font-medium">{job.company.name}</span>
          </div>
        </div>
        <span className="bg-[#E6F4EA] text-[#00A86B] text-xs font-bold px-3 py-1 rounded-full border border-[#00A86B]/20">
          Sponsorship: Active
        </span>
      </div>

      <div className="flex gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <Wallet size={14} />
          {job.salary}
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
        View Details
      </button>
    </div>
  );
}