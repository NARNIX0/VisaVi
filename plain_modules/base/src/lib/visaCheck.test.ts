import { validateSponsorship } from './visaCheck';
import { Job } from '../types';

describe('VisaSponsorCheck Functionality', () => {
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Valid Job',
      location: 'London',
      salary: '50k',
      description: 'Desc',
      company: { id: 'c1', name: 'Sponsor Co', hasActiveSponsorshipLicence: true }
    },
    {
      id: '2',
      title: 'Invalid Job',
      location: 'London',
      salary: '50k',
      description: 'Desc',
      company: { id: 'c2', name: 'Non-Sponsor Co', hasActiveSponsorshipLicence: false }
    }
  ];

  it('should filter out jobs from companies without active sponsorship licences', () => {
    const result = validateSponsorship(mockJobs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].company.name).toBe('Sponsor Co');
  });

  it('should return an empty array if no jobs have active sponsorship', () => {
    const invalidJobs = [mockJobs[1]];
    const result = validateSponsorship(invalidJobs);
    expect(result).toHaveLength(0);
  });
});