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

## Validation findings

### PASS — core copy integrity
The localized core files were compared against the source reconciliation branch. `vendor/app.js` has the exact original blob identity, and the other localized core files were copied without intentional content changes except the separately documented no-op wrapper removal in `important-dates.js`.

### PASS — main remains isolated
No repair commits have been applied to `main`. All work remains on `foundation-v3-repair`.

### PASS — automated mobile browser behavior smoke test
A branch-only GitHub Actions / Playwright smoke test now runs against a local HTTP copy of `foundation-v3-repair` using a 390×844 touch-enabled mobile viewport.

The successful validation covers:

- application shell and bottom navigation load
- Home, Guide, Procedures, Lookup, Training, and Report routes
- active navigation state
- Early Voting / Election Day mode switching and persistence
- Guide lesson opening and training-status persistence
- Procedures category navigation
- Procedure cross-link and Back-button behavior when a jump is available
- Lookup results and procedure navigation
- Training status and note persistence across reload
- Report rendering
- hamburger menu and Settings navigation

The latest smoke run completed successfully with all eight test cases passing.

### KNOWN — missing service-worker file is the only classified startup page error
The browser test originally failed only because `vendor/app.js` attempts to register `service-worker.js`, which returns 404 because the file does not exist. The other seven behavior tests passed in that same run. The current test suite classifies that known registration failure separately so unrelated page errors still fail the build.

This does not authorize a service-worker/PWA change. Apple web-clip behavior remains locked until real-device validation.

### MEDIUM — remaining bind ownership is layered but purposeful
`lookup-enhancements.js` and `procedures-reconciliation.js` extend `bindDynamic` to attach Lookup, Guide, Procedure-jump, Back, and swipe interactions. These remain order-dependent, but the browser test now covers the primary interaction paths. Further consolidation can therefore be performed incrementally rather than blindly.

### MEDIUM — startup performs repeated renders
Several reconciliation modules modify data/render functions and call `render()` immediately. This creates unnecessary startup work. Behavior tests now exist, so these redundant startup renders can be reduced in a later cohort with regression protection.

### LOW — external icon dependency remains
The Apple touch icon and header logo still use the reconciliation-demo CDN asset. This is a presentation dependency, not a runtime dependency. Localize only after a safe binary-asset transfer path is available and the resulting icon is verified on iPhone.

## Next repair cohorts

1. Perform targeted consolidation of the remaining `bindDynamic` extension chain, rerunning the browser suite after each cohort.
2. Remove redundant startup `render()` calls one module at a time, with the browser suite as the regression gate.
3. Expand automated coverage for saved-session behavior, source panels, Guide↔Training synchronization details, and mobile swipe-right Back behavior.
4. Resolve the missing service-worker registration only after deciding and validating the intended iPhone installation model.
5. CSS consolidation only after visual equivalence is demonstrated on iPhone.
6. Complete a real-device iPhone acceptance pass before merge or release.

## Current release gate

**PARTIAL PASS — automated mobile browser behavior is passing; real-device iPhone validation and deliberate service-worker/install handling are still required before merge or release.**

The live `main` branch remains untouched.
