# TEST-APP-2 — FOUNDATION v3 Retrofit Audit

Date: 2026-08-25

## Locked mission

Preserve the proven TEST-APP-2 product experience while reducing structural fragility underneath it.

### Must preserve
- Existing visible UI and navigation behavior unless a confirmed defect requires a targeted repair.
- Early Voting / Election Day mode behavior.
- Guide, Procedures, Lookup, Training, Report, sourcing, aliases, cross-links, and field-reference content.
- Current user-state semantics unless an explicit migration is required.
- Apple web-clip behavior unless real-device testing shows a defect.

### Do not do in this retrofit
- No redesign for architecture's sake.
- No framework migration.
- No replacement of TEST-APP-2 with the clean Master app.
- No edits to `main` during the repair pass.
- No removal of proven content or workflows merely to simplify code.

## Preservation state

`main` baseline commit: `9edda6a5e440e08fe72555e32a03d1170cb1c275`

Preservation branch: `preservation-2026-08-25`

Working branch: `foundation-v3-repair`

## Initial findings

### HIGH — mixed application ownership
`index.html` loads the base application plus numerous later repair layers. Several scripts participate in render/navigation/state behavior, creating order-dependent behavior and a broad regression surface.

### HIGH — remote runtime dependency
A large part of the production shell is loaded from `phshbone/Master-PW-Training-@reconciliation-demo` through jsDelivr. TEST-APP-2 is therefore not yet self-contained.

### MEDIUM — navigation/chrome repair accumulation
Historical structural and viewport fixes show competing attempts to own the same fixed/sticky shell behavior. This is consistent with the observed floating-navigation failure mode.

### MEDIUM — state synchronization added after the base model
Guide/training/report synchronization is spread across later repair passes rather than clearly owned by one state layer.

### MEDIUM — CSS ownership overlap
Multiple stylesheets affect shared shell/card/navigation behavior. Visual repair work can therefore have unrelated blast radius.

## Phase 1 completed

Removed four files from the working branch that were not loaded by the current `index.html` and represented superseded, competing shell strategies:

- `structural-shell.js`
- `structural-shell.css`
- `viewport-dock.js`
- `viewport-dock.css`

These remain preserved on `main` and `preservation-2026-08-25`.

## Next repair cohorts

1. Runtime dependency localization: copy the exact `reconciliation-demo` assets currently loaded remotely into TEST-APP-2 and point the working branch at local copies without changing behavior.
2. Render ownership consolidation: map every loaded render wrapper, classify each behavior, and fold proven behavior into one controlled lifecycle.
3. Navigation/state consolidation: establish a single owner for route changes, back behavior, mode changes, and shared training state while preserving current UI semantics.
4. CSS consolidation: remove duplicate ownership only after visual equivalence is demonstrated.
5. Validation: syntax checks, route/state checks, cross-link/source checks, then iPhone real-device validation before any release gate.

## Current release gate

**BLOCKED — retrofit in progress.**

The live `main` branch is untouched.