import { Job } from '../types';

/**
 * :VisaSponsorCheck:
 * Validates that only companies with active UK sponsor licences are allowed.
 */
export const validateSponsorship = (jobs: Job[]): Job[] => {
  return jobs.filter(job => {
    if (!job.company.hasActiveSponsorshipLicence) {
      console.warn(`Filtering out job ${job.id}: Company ${job.company.name} lacks active sponsorship licence.`);
      return false;
    }
    return true;
  });
};