# TEST-APP-2 — FOUNDATION v3 Acceptance Record

Date: 2026-08-25

## Scope

This record captures the acceptance state of the in-place FOUNDATION v3 retrofit on `foundation-v3-repair`. It does not authorize merge to `main`.

## Real-device iPhone acceptance

A branch-only preview of the repaired application was exercised on an actual iPhone after the structural retrofit and runtime localization work.

Observed result:

- App loaded and responded quickly.
- Home, Guide, Procedures, Lookup, Training, and Report navigation worked.
- Primary tabs moved between sections correctly.
- Back controls worked across the tested paths.
- Overall interaction felt materially more immediate than the pre-repair build.
- No new real-device shell or bottom-navigation failure was reported during the acceptance pass.

## Targeted follow-up repair

Real-device testing exposed one remaining navigation-precision defect: following a deep link near the lower part of a Procedure card and then returning restored the correct Procedure but not the exact originating position.

The return system was updated to preserve the originating control and its viewport position inside the application's actual scroll container (`#mainContent`).

A dedicated regression test was added for this behavior. The first automated attempt proved that window-level scroll restoration was insufficient; the repair was then corrected to restore position in the app scroll pane.

Final automated result after the correction:

- 9 mobile smoke/regression tests passed.
- Deep-link return-position regression passed.
- Existing primary-route, persistence, Lookup, Training, Report, menu, and navigation tests continued to pass.

## Current gate

**PASS WITH WARNINGS — suitable for continued polish and controlled pre-merge review.**

The retrofit is no longer blocked by foundational or primary-navigation failures.

## Remaining warnings / deliberate holds

1. `vendor/app.js` still attempts to register a missing `service-worker.js`. This is a known pre-existing registration failure. Do not add a service worker merely for architectural completeness; the intended iPhone installation model must be decided deliberately.
2. The Apple touch icon / header logo still depends on the reconciliation-demo CDN asset. This is a presentation dependency, not application runtime logic.
3. `bindDynamic` ownership remains layered in several compatibility modules. Current behavior is covered by regression tests, so any further consolidation should be incremental and test-gated.
4. Several reconciliation modules still perform startup `render()` calls. These can be optimized later, but only one cohort at a time with regression coverage.
5. Typography and spacing refinements are subjective polish and should be reviewed visually rather than changed during structural repair.

## Release protection

- `main` remains untouched.
- `preservation-2026-08-25` remains the untouched safety checkpoint.
- `foundation-v3-repair` remains the working repair branch.
- `iphone-validation-2026-08-25` is the branch used for real-device preview validation and should be advanced only to tested repair commits.

No merge or live deployment is authorized by this acceptance record.
