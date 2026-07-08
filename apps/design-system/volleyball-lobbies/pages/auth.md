# Auth Page Overrides

> **PROJECT:** Volleyball Lobbies
> **Generated:** 2026-07-08 15:09:05
> **Page Type:** Authentication

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 460px (narrow, focused auth card centered on the page)
- **Layout:** Single column, vertically centered card on a tinted background
- **Sections:** 1. Brand mark + heading, 2. Google sign-in (primary), 3. Divider, 4. Email/password form, 5. Switch link (login ⇄ sign up)

### Spacing Overrides

- **Content Density:** Low — one clear action per view

### Typography Overrides

- No overrides — use Master typography (Barlow / Barlow Condensed)

### Color Overrides

- **Strategy:** Inherit the Mikasa Master palette. Card on white surface, deep-blue `#235789` primary CTA, yellow `#F1D302` reserved for the brand mark/accent only (not the submit button, to keep the form calm). Inline field errors use `--color-destructive`.

### Form Rules (from ux domain search)

- Inline validation: show each field's error **below the field**, only after it is touched/dirty.
- Password field: include a show/hide visibility toggle.
- Submit: loading → success/error state; disable submit while pending.
- Error recovery: give a clear next step (e.g. "email already registered → log in").
- Focus: keep visible focus rings (`--color-ring`); never remove outline without a replacement.

### Component Overrides

- Avoid: No feedback after submit
- Avoid: Force linear unskippable tour
- Avoid: Placeholder-only inputs

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: Hover states on CTA (color shift, slight scale), form field focus animations, loading spinner, success feedback
- Forms: Show loading then success/error state
- Onboarding: Provide Skip and Back buttons
- Accessibility: Use label with for attribute or wrap input
- CTA Placement: Form CTA: Submit button
