// Profile fields stored in the app (populated from CV upload or edited manually).
export interface UserProfile {
  fullName: string;
  university: string;
  degree: string;
  graduationYear: string;
  location: string;
  visaStatus: string;
  visaExpiry: string;
  bio: string;
  skills: { name: string; level: number }[];
  experience: { title: string; company: string; period: string }[];
  tags: string[];
}

export const emptyProfile: UserProfile = {
  fullName: "",
  university: "",
  degree: "",
  graduationYear: "",
  location: "",
  visaStatus: "",
  visaExpiry: "",
  bio: "",
  skills: [],
  experience: [],
  tags: [],
};

/** @deprecated Use emptyProfile — kept for type re-exports only. */
export const userProfile = emptyProfile;

export interface ProfileState extends UserProfile {
  baseCv: string;
  cvFileName?: string;
}

/** Fill missing fields (e.g. after schema changes or partial CV parse). */
export function normalizeProfileState(
  profile: Partial<ProfileState>
): ProfileState {
  return {
    ...emptyProfile,
    ...profile,
    fullName: profile.fullName ?? "",
    university: profile.university ?? "",
    degree: profile.degree ?? "",
    graduationYear: profile.graduationYear ?? "",
    location: profile.location ?? "",
    visaStatus: profile.visaStatus ?? "",
    visaExpiry: profile.visaExpiry ?? "",
    bio: profile.bio ?? "",
    baseCv: profile.baseCv ?? "",
    skills: profile.skills ?? [],
    experience: profile.experience ?? [],
    tags: profile.tags ?? [],
  };
}
