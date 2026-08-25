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
A large part of the production shell was loaded from `phshbone/Master-PW-Training-@reconciliation-demo` through jsDelivr. TEST-APP-2 was therefore not self-contained.

### MEDIUM — navigation/chrome repair accumulation
Historical structural and viewport fixes show competing attempts to own the same fixed/sticky shell behavior. This is consistent with the observed floating-navigation failure mode.

### MEDIUM — state synchronization added after the base model
Guide/training/report synchronization is spread across later repair passes rather than clearly owned by one state layer.

### MEDIUM — CSS ownership overlap
Multiple stylesheets affect shared shell/card/navigation behavior. Visual repair work can therefore have unrelated blast radius.

## Phase 1 completed — dead shell ownership removed

Removed four files from the working branch that were not loaded by the current `index.html` and represented superseded, competing shell strategies:

- `structural-shell.js`
- `structural-shell.css`
- `viewport-dock.js`
- `viewport-dock.css`

These remain preserved on `main` and `preservation-2026-08-25`.

## Phase 2 completed — lifecycle ownership reduced

- Removed duplicate Guide-to-Training synchronization from `functional-fixes.js`; fuller synchronization remains owned by `training-navigation-fixes.js`.
- Reduced `review-pass.js` from a broad catch-all repair layer to its unique Lookup ranking and Reprint guidance responsibilities.
- Removed render wrapping from `guide-status-warning-pass.js` and `clean-shell.js`.
- Established `training-navigation-fixes.js` as the single local post-core render-lifecycle owner.
- Replaced the shell cleanup render wrapper with the controlled `mpw:rendered` event.
- Removed a no-op `bindDynamic` wrapper from `vendor/important-dates.js`.

## Phase 3 completed — runtime localized

The runtime files previously loaded from `Master-PW-Training-@reconciliation-demo` are now copied into TEST-APP-2 under `vendor/` and `index.html` points to the local copies.

Localized core/runtime assets include:

- `vendor/styles.css`
- `vendor/reconciliation.css`
- `vendor/procedure-styles.css`
- `vendor/mobile-qa.css`
- `vendor/data.js`
- `vendor/app.js`
- `vendor/lookup-enhancements.js`
- `vendor/procedures-reconciliation.js`
- `vendor/correction-record-update.js`
- `vendor/source-reconciliation.js`
- `vendor/master-reference.js`
- `vendor/master-pin.js`
- `vendor/important-dates.js`
- `vendor/home-report-reconciliation.js`
- `vendor/qa-fixes.js`

`vendor/app.js` was normalized to the exact source blob from the reconciliation baseline before any behavior-changing core edit.

The only remaining reconciliation-demo reference in `index.html` is the visual app icon. It is not part of application runtime logic.

## Validation findings — current pass

### PASS — core copy integrity
The localized core files were compared against the source reconciliation branch. `vendor/app.js` now has the exact original blob identity, and the other localized core files were copied without intentional content changes except the separately documented no-op wrapper removal in `important-dates.js`.

### PASS — main remains isolated
No repair commits have been applied to `main`. All work remains on `foundation-v3-repair`.

### MEDIUM — remaining bind ownership is layered but purposeful
`lookup-enhancements.js` and `procedures-reconciliation.js` extend `bindDynamic` to attach Lookup, Guide, Procedure-jump, Back, and swipe interactions. These are still order-dependent, but they are functional behavior rather than obviously dead wrappers. They should not be collapsed until browser/device equivalence is tested.

### MEDIUM — startup performs repeated renders
Several reconciliation modules modify data/render functions and call `render()` immediately. This creates unnecessary startup work, but removing those calls before browser validation could alter initialization order. Defer this optimization until behavior tests exist.

### MEDIUM — service-worker registration points to a missing file
The exact base `vendor/app.js` attempts to register `service-worker.js`, but no such file exists on the repair branch. This is a pre-existing broken registration path. Because the project currently relies on Apple web-clip behavior and PWA behavior is locked for preservation, do not change this line until iPhone/browser validation confirms the correct replacement behavior.

### LOW — external icon dependency remains
The Apple touch icon and header logo still use the reconciliation-demo CDN asset. This is a presentation dependency, not a runtime dependency. Localize only after a safe binary-asset transfer path is available and the resulting icon is verified on iPhone.

## Next repair cohorts

1. Browser behavior validation of all primary routes and mode switching on `foundation-v3-repair`.
2. Validate Procedure cross-links, Back stack, swipe-right behavior, Lookup jumps, Guide statuses, Training synchronization, Report/session save, and Settings backup semantics.
3. After behavior equivalence is established, collapse remaining `bindDynamic` extension chains into one controlled binding lifecycle.
4. Remove redundant startup `render()` calls only after the initialization order is covered by tests.
5. Resolve the missing service-worker registration deliberately: either remove the dead registration while preserving web-clip behavior or add a tested service-worker strategy. Do not guess.
6. CSS consolidation only after visual equivalence is demonstrated on iPhone.

## Current release gate

**BLOCKED — structural retrofit is substantially improved, but browser/iPhone behavior validation is still required before merge or release.**

The live `main` branch remains untouched.
