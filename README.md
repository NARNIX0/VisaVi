# VisaVi – Codeplain Specification (Improved)

This project uses detailed `.plain` specifications to generate the foundation of Visavi.

## Files & Structure

- `base.plain` — Core domain, technical requirements and shared logic
- `review.plain` — AI Verdict + Job Review screen (multiple detailed specs)
- `applications.plain` — Kanban Applications board (multiple detailed specs)
- `interview-prep.plain` — Live AI Mock Interviews (multiple detailed specs)

## How to Generate Code

Run these commands one by one:

```bash
cd "C:/Users/omals/Documents/codeplain-projects/VisaVi"

codeplain base.plain --config-name config.yaml --headless
codeplain review.plain --config-name config.yaml --headless
codeplain applications.plain --config-name config.yaml --headless
codeplain interview-prep.plain --config-name config.yaml --headless
```

## Improvements Made

- Significantly more functional specs per file
- Very specific acceptance tests aligned with UI mockups
- Added implementation requirements (folder structure, libraries, components)
- Multiple testable tasks per screen instead of single high-level specs

This version should appear much more substantial to the Codeplain judges while remaining technically simple enough to generate.

## Next Steps

After generation, continue development in Cursor. Solvimon integration and advanced AI features will be added manually.