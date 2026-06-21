# VisaVi – Product Requirements Document (PRD)

**Project:** VisaVi – AI-Powered Job Platform for International Students Seeking Visa Sponsorship  
**Version:** 2.0 (Comprehensive)  
**Date:** June 2026  
**Objective:** Create a production-ready, visually accurate implementation of the provided UI mockups using Next.js + Tailwind + shadcn/ui, built on top of the existing Codeplain foundation where viable.

---

## 1. Design System & Visual Language

**Primary Brand Green:** `#00C853` – `#22C55E` (used for sidebar, primary CTAs, progress bars, accents)  
**Light Green / Mint:** `#E8F5E9`, `#F0FDF4` (used for AI Verdict panels, recommendation boxes)  
**Sidebar Green:** Solid `#16A34A` – `#15803D`  
**Card Background:** `#FFFFFF` with subtle drop shadows (`shadow-md`)  
**Text Colors:**
- Primary: `#111827` (near black)
- Secondary: `#6B7280` (gray)
- Success/Green text: `#15803D`

**Typography:** System sans-serif (Inter / system-ui)  
**Border Radius:** 8px (small), 12px (cards), 9999px (pills/buttons)  
**Shadows:** `shadow-sm` and `shadow-md` on cards

---

## 2. Screen-by-Screen Detailed Requirements

### Screen 1: Landing Page (Artboard 1.jpg)

**Layout & Structure**
- Full-width bright green header bar (~85–90px tall)
- White hero section with generous vertical padding (~120–140px top & bottom)
- Content centered in ~1200px container
- Two black line-art illustrations flanking the CTA buttons at the bottom

**Header Bar**
- Left: “visavi” logo in bold black lowercase sans-serif
- Right: Navigation menu (Features ▼, Resources ▼, Company ▼, Pricing, Mobile App, Employers) in dark gray/black

**Hero Content (centered)**
- Small black four-pointed star/asterisk icon at top
- Large bold headline (48–56px): “Find UK jobs that can actually sponsor you…”
- Subheadline (18–20px, light gray): “Visavi helps international students discover sponsorship-friendly employers, generate tailored applications, and track every opportunity in one place.”
- Two vertically stacked buttons:
  - Bright green pill button: “Sign in” (white text)
  - Light gray pill button: “Create account” (darker gray text)

**Illustrations**
- Left: Woman with hair in a bun, wearing earphones, using laptop with coffee mug beside her (black line art)
- Right: Man with glasses, hand on chin, thoughtful expression, clipboard above, books below (black line art)

**Style Notes:** Minimalist, trustworthy, student-oriented, high contrast, ample white space.

---

### Screen 2: Job Recommendation Card (Artboard 2.jpg)

**Main Element:** Large elevated white card with bright green top border strip

**Header Row**
- Blue square logo with purple/blue starburst icon
- Job title: **Full Stack Engineer** (bold, 24px+)
- Company: **Blue Light Card** + green verified checkmark
- Meta row (icons + gray text): Location pin “London, UK”, Briefcase “Full-time”, Coin “£55,000 – £65,000”
- Right side: Circular **83 MATCH SCORE** progress ring (green) with label below

**Tags Row**
- Three light gray pills with icons: Hybrid (house), Visa Sponsorship (shield), Tech for Good (heart)

**Two-Column Body**
- **Left Column (AI Recommendation)** – light green background:
  - “AI RECOMMENDATION” header + sparkle icon
  - Large green heading: **Strong Match**
  - Explanation paragraph
  - Two metrics:
    - Interview Chance **62%** (green upward arrow + green “High” pill)
    - Offer Chance **13%** (orange upward arrow + orange “Medium” pill)
  - “Why?” section with three green checkmarks

- **Right Column**:
  - “About this role” heading + paragraph
  - Three requirement pills (React, Node.js, TypeScript | 3+ Years Experience | Agile Environment)
  - “About Blue Light Card” section + “View company profile” link

**Bottom Action Bar**
- Four buttons: View Details | Ask AI | Find Recruiter | **One-Click Apply** (dark green with rocket icon + subtext)

**Floating Action Buttons**
- Left: White circle “Pass” button with black X
- Right: White circle “Save” button with green heart

**Footer Note:** Shield icon + “Horizon only shows jobs from companies with active sponsor licences.”

---

### Screen 3: Job Review / AI Verdict (Artboard 3.jpg – Deloitte)

**Layout:** Three-column (Left Sidebar | Main Content | Right Sidebar)

**Main Content Sections:**

1. **Job Header**
   - Black square “D.” logo
   - Title: **Graduate Analyst**
   - Company: Deloitte + green verified checkmark
   - Light green pill: “Sponsorship: Active”
   - Metadata: London, UK | Full-time | £38,000
   - Tags: Early Careers, Finance & Consulting
   - “Posted 2 days ago”

2. **AI VERDICT Section** (light mint-green background)
   - Header: sparkle icon + “AI VERDICT”
   - Large green text: **Strong Apply**
   - Description paragraph
   - Large circular progress indicator (92% filled, green gradient) labeled “Overall Match”
   - Two side metrics: Interview Chance 64%, Offer Chance 14% (both with green upward arrows)

3. **Job Summary**
   - Paragraph describing responsibilities
   - Four metadata rows with icons (Department, Start Date, Experience, Education)

4. **Skills Match**
   - Four horizontal progress bars:
     - Financial Analysis: 100%
     - Excel: 90%
     - Data Analysis: 80%
     - PowerPoint: 70%

**Right Sidebar**
- “Why Visavi Recommends This Role” (4 green checks + 1 orange warning triangle)
- “About Deloitte” (4 metric pills + description)
- “AI Tools” (One-Click Apply, Find Recruiter, Mock Interview, Ask AI)

**Bottom Action Bar**
- Reject (red outline) | Save for later | Outreach | **One-Click Apply** (dark green with sparkle)

---

### Screen 4: Applications Kanban (Artboard 4.jpg)

**Layout:** Green sidebar + white main area

**Top Section**
- Title “My Applications” + subtitle
- Controls: Search bar, Filters button, green “+ Add Application” button
- Six summary cards (All 24, Applied 10, In Progress 5, Interview 3, Offer 1, Rejected 5)

**Kanban Board – 6 Columns (pastel headers)**

1. **Saved** (light gray, bookmark icon) – 4 cards (Microsoft, Monzo, Shopify, Airbnb)
2. **Applied** (light blue, paper plane icon) – 10 cards (Blue Light Card, Revolut, Wise, Deliveroo)
3. **Assessment** (light yellow, clipboard icon) – 5 cards with yellow “Due X days” badges (Deloitte, JPMorgan, BAE Systems)
4. **Interview** (light purple, calendar icon) – 3 cards with date + time (Google, Meta, Amazon)
5. **Offer** (light green, trophy icon) – 1 card (Spotify)
6. **Rejected** (light red, red X icon) – 5 cards (Unilever, Samsung, EY)

Each job card includes: Company logo, Role, Location, relative date.

**Footer:** Green-bordered AI Tip bar

---

### Screen 5: Interview Prep (Artboard 5.jpg)

**Three-Column Layout**

**Column 1 – Upcoming Interviews**
- Three cards with match scores (Deloitte 92%, Google 88%, JPMorgan 85%)
- “View all applications” button

**Column 2 – Live Mock Interview**
- Header: “Mock Interview” + green “Live” dot + timer “04:32” + red “End” button
- AI message bubble + User response bubble with timestamps
- “Test Yourself” section with “Start Test” button

**Column 3 – Live Feedback**
- Five horizontal progress bars with scores (Communication 8.5, Confidence 7.8, Structure 8.0, Relevance 9.0, Technical Depth 7.2)
- Circular progress “3/8 Questions”
- Countdown “18:20”
- Difficulty: Hard (three purple squares)
- AI Suggestions list (3 items with colored dots)
- “View suggestion” button

---

## 3. Data Models (Recommended)

```ts
interface Job { ... }
interface Application { ... }
interface InterviewMetrics { ... }
```

(Full interfaces to be defined in Cursor prompts)

---

## 4. Technical Stack Recommendations

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for state
- @hello-pangea/dnd for Kanban
- Dummy data + Solvimon mock integration

---

*This PRD is intentionally exhaustive to allow Cursor to make accurate visual and structural decisions without guessing.*
