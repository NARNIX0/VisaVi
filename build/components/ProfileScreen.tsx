"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Pencil,
  Trophy,
  Calendar,
  Send,
  Inbox,
  FileText,
  Upload,
  Check,
  X,
  Loader2,
  Tag,
  Plus,
} from "lucide-react";
import { currentUser } from "@/data/user";
import { useCredits } from "@/hooks/useCredits";
import { useAppStore } from "@/hooks/useAppStore";
import { pdfFileToDataUrls } from "@/lib/pdf-to-images-client";
import { parseCvProfile } from "@/lib/client-ai";
import { extractTagsFromCv } from "@/lib/extract-tags-from-cv";
import { normalizeProfileState, type ProfileState } from "@/data/profile";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
      </div>
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

function getInitials(name: string | undefined) {
  return (
    (name ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || currentUser.initials
  );
}

function empty(v: unknown) {
  const s = typeof v === "string" ? v : v == null ? "" : String(v);
  return s.trim() ? s : "—";
}

export function ProfileScreen() {
  const isPro = useCredits((s) => s.isPro);
  const profile = normalizeProfileState(useAppStore((s) => s.profile));
  const updateProfile = useAppStore((s) => s.updateProfile);
  const applications = useAppStore((s) => s.applications);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUploadError, setCvUploadError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const total = applications.length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const interviews = applications.filter((a) => a.status === "Interview").length;
  const offers = applications.filter((a) => a.status === "Offer").length;

  function startEdit() {
    setDraft(normalizeProfileState(profile));
    setEditing(true);
  }

  function saveEdit() {
    updateProfile(normalizeProfileState(draft));
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(normalizeProfileState(profile));
    setEditing(false);
    setNewTag("");
  }

  function applyParsedFields(parsed: Partial<ProfileState>, text: string, fileName: string) {
    const patch = normalizeProfileState({
      ...parsed,
      baseCv: text,
      cvFileName: fileName,
    });
    updateProfile(patch);
    if (editing) {
      setDraft((d) => normalizeProfileState({ ...d, ...patch }));
    }
  }

  async function onCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvUploadError(null);
    setCvUploading(true);

    try {
      const lower = file.name.toLowerCase();
      const isPdf = file.type === "application/pdf" || lower.endsWith(".pdf");

      let res: Response;

      if (isPdf) {
        const images = await pdfFileToDataUrls(file);
        res = await fetch("/api/extract-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images, fileName: file.name }),
        });
      } else {
        const form = new FormData();
        form.append("file", file);
        res = await fetch("/api/extract-cv", { method: "POST", body: form });
      }

      const data = (await res.json()) as { text?: string; fileName?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to extract CV text");
      }

      const text = data.text ?? "";
      const fileName = data.fileName ?? file.name;
      const tags = extractTagsFromCv(text);

      let parsed: Partial<ProfileState> = {};
      try {
        parsed = await parseCvProfile(text);
      } catch {
        // CV text saved even if profile parse fails
      }

      applyParsedFields({ ...parsed, tags }, text, fileName);
    } catch (err) {
      setCvUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setCvUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addTag() {
    const tag = newTag.trim();
    if (!tag) return;
    setDraft((d) => ({
      ...d,
      tags: d.tags.includes(tag) ? d.tags : [...d.tags, tag],
    }));
    setNewTag("");
  }

  function removeTag(tag: string) {
    setDraft((d) => ({ ...d, tags: d.tags.filter((t) => t !== tag) }));
  }

  function addSkill() {
    setDraft((d) => ({
      ...d,
      skills: [...d.skills, { name: "New skill", level: 70 }],
    }));
  }

  function addExperience() {
    setDraft((d) => ({
      ...d,
      experience: [
        ...d.experience,
        { title: "Role title", company: "Company", period: "2024 – Present" },
      ],
    }));
  }

  const p = normalizeProfileState(editing ? draft : profile);
  const displayName = (p.fullName ?? "").trim() || currentUser.name;

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Your Profile</h1>
          <p className="mt-1 text-zinc-500">
            Upload your CV to auto-fill details, then edit anything below.
          </p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-zinc-700">
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button onClick={saveEdit} className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
              <Check className="h-4 w-4" />
              Save
            </button>
          </div>
        ) : (
          <button onClick={startEdit} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
            <Pencil className="h-4 w-4" />
            Edit profile
          </button>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#18BE5C] to-[#11A04E] text-2xl font-bold text-white">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-lg font-bold"
                placeholder="Full name"
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900">{displayName}</h2>
                {isPro && (
                  <span className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-semibold text-brand-dark">Pro</span>
                )}
              </div>
            )}
            <p className="text-sm text-zinc-500">{currentUser.email}</p>
            {editing ? (
              <div className="mt-3 space-y-2">
                <input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Location"
                />
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  placeholder="Professional summary"
                />
              </div>
            ) : (
              <>
                <div className="mt-3 flex flex-wrap gap-x-4 text-sm text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    {empty(p.location)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-zinc-400" />
                    {p.degree || p.university
                      ? `${empty(p.degree)}${p.graduationYear ? `, ${p.graduationYear}` : ""}`
                      : "—"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-600">{empty(p.bio)}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Applications" value={total} icon={Inbox} color="#22C55E" />
        <StatCard label="Applied" value={applied} icon={Send} color="#3B82F6" />
        <StatCard label="Interviews" value={interviews} icon={Calendar} color="#A855F7" />
        <StatCard label="Offers" value={offers} icon={Trophy} color="#22C55E" />
      </div>

      {/* CV section */}
      <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
            <FileText className="h-4 w-4 text-brand" />
            Base CV
          </div>
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" className="hidden" onChange={onCvUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={cvUploading}
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {cvUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {cvUploading ? "Extracting & parsing…" : "Upload PDF / DOCX"}
            </button>
          </div>
        </div>
        {profile.cvFileName && (
          <p className="mt-2 text-xs text-brand-dark">Uploaded: {profile.cvFileName}</p>
        )}
        {cvUploadError && (
          <p className="mt-2 text-xs text-red-600">{cvUploadError}</p>
        )}
        {!cvUploading && !profile.baseCv.trim() && (
          <p className="mt-2 text-xs text-zinc-400">
            Upload a CV to populate your profile, skills, and tags automatically.
          </p>
        )}
        {editing ? (
          <textarea
            value={draft.baseCv}
            onChange={(e) => setDraft({ ...draft, baseCv: e.target.value })}
            rows={14}
            className="mt-3 w-full rounded-lg border p-3 font-mono text-xs text-zinc-700"
            placeholder="CV text appears here after upload…"
          />
        ) : (
          <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-xs text-zinc-700">
            {profile.baseCv?.trim() || "No CV uploaded yet."}
          </pre>
        )}
      </div>

      {/* Tags */}
      <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
          <Tag className="h-4 w-4 text-brand" />
          Tags
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Keywords extracted from your CV by AI — used for job matching.
        </p>
        <div className="mt-3 min-h-[3rem] rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          {p.tags.length === 0 ? (
            <p className="text-sm text-zinc-400">Upload a CV to generate tags.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-medium text-brand-dark"
                >
                  {tag}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-brand/10"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {editing && (
          <div className="mt-2 flex gap-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add a tag…"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Visa &amp; Work Eligibility
          </div>
          {editing ? (
            <div className="mt-3 space-y-2">
              <input
                value={draft.visaStatus}
                onChange={(e) => setDraft({ ...draft, visaStatus: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Visa status"
              />
              <input
                value={draft.visaExpiry}
                onChange={(e) => setDraft({ ...draft, visaExpiry: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Expiry date"
              />
            </div>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-zinc-400">Status</dt>
                <dd className="font-medium">{empty(p.visaStatus)}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Expiry</dt>
                <dd className="font-medium">{empty(p.visaExpiry)}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <GraduationCap className="h-4 w-4 text-brand" />
            Education
          </div>
          {editing ? (
            <div className="mt-3 space-y-2">
              <input
                value={draft.university}
                onChange={(e) => setDraft({ ...draft, university: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="University"
              />
              <input
                value={draft.degree}
                onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Degree"
              />
              <input
                value={draft.graduationYear}
                onChange={(e) => setDraft({ ...draft, graduationYear: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Graduation year"
              />
            </div>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-zinc-400">University</dt>
                <dd className="font-medium">{empty(p.university)}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Degree</dt>
                <dd className="font-medium">{empty(p.degree)}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-400">Graduation</dt>
                <dd className="font-medium">{empty(p.graduationYear)}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4 text-brand" />
              Experience
            </div>
            {editing && (
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-medium text-brand-dark hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add role
              </button>
            )}
          </div>
          {p.experience.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">No experience listed yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {p.experience.map((exp, i) => (
                <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        value={exp.title}
                        onChange={(e) => {
                          const experience = [...draft.experience];
                          experience[i] = { ...exp, title: e.target.value };
                          setDraft({ ...draft, experience });
                        }}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="Job title"
                      />
                      <input
                        value={exp.company}
                        onChange={(e) => {
                          const experience = [...draft.experience];
                          experience[i] = { ...exp, company: e.target.value };
                          setDraft({ ...draft, experience });
                        }}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="Company"
                      />
                      <input
                        value={exp.period}
                        onChange={(e) => {
                          const experience = [...draft.experience];
                          experience[i] = { ...exp, period: e.target.value };
                          setDraft({ ...draft, experience });
                        }}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                        placeholder="Period"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-zinc-900">{exp.title}</p>
                      <p className="text-sm text-zinc-600">{exp.company}</p>
                      <p className="text-xs text-zinc-400">{exp.period}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Briefcase className="h-4 w-4 text-brand" />
              Skills
            </div>
            {editing && (
              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-1 text-xs font-medium text-brand-dark hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add skill
              </button>
            )}
          </div>
          {p.skills.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">No skills listed yet.</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.skills.map((skill, i) => (
                <div key={`${skill.name}-${i}`}>
                  {editing ? (
                    <div className="flex gap-2">
                      <input
                        value={skill.name}
                        onChange={(e) => {
                          const skills = [...draft.skills];
                          skills[i] = { ...skill, name: e.target.value };
                          setDraft({ ...draft, skills });
                        }}
                        className="min-w-0 flex-1 rounded-lg border px-2 py-1 text-sm"
                      />
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={skill.level}
                        onChange={(e) => {
                          const skills = [...draft.skills];
                          skills[i] = { ...skill, level: Number(e.target.value) };
                          setDraft({ ...draft, skills });
                        }}
                        className="w-16 rounded-lg border px-2 py-1 text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span className="font-semibold">{skill.level}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-zinc-200">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${skill.level}%` }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
