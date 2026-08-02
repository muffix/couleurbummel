# React Native Upgrade Runbook: 0.75.3 → 0.86

This document is the working runbook for upgrading Couleurbummel from React
Native **0.75.3** (React 18.3.1, legacy architecture, Hermes) to the latest
stable **0.86.x** (React 19.2, New Architecture only, Hermes V1).

The upgrade is executed in **6 grouped milestones**, each shippable as its own
PR behind a green build + tests + manual smoke. We prioritise safety over
speed: the React 19 jump (0.80) and the New-Architecture-only gate (0.82) are
the two one-way doors and each gets a dedicated step.

## Principles

1. **One milestone = one PR.** Keep `main` always green. Use a long-lived
   `upgrade/rn` branch with sub-PRs, or merge sequential milestones to `main`.
2. **The React Native Upgrade Helper is the source of truth** for per-version
   native file diffs:
   https://react-native-community.github.io/upgrade-helper/
   Select the exact from→to versions for each milestone and apply the diff
   manually (we are NOT an Expo project).
3. **Per-milestone validation gate** (every milestone, no exceptions):
   1. `yarn install` (Berry, `--immutable`) + `bundle exec pod install` (iOS)
      + clean Gradle (`cd android && ./gradlew --stop`).
   2. `yarn lint` and `yarn test` must be green (or no worse than baseline — see
      "Known baseline issue" below).
   3. Clean build iOS **and** Android (simulator/emulator is sufficient).
   4. Manual smoke (see checklist below).
4. **Never skip the New Architecture enablement at 0.81.** The RN team
   explicitly recommends enabling New Arch on 0.81 *before* crossing to 0.82
   (where legacy arch is gone). See the 0.82 release post.
5. **Commit `yarn.lock` + `Podfile.lock` + `package.json` together** at each
   milestone. Do not let node_modules drift from the lockfile (we hit this at
   the start: node_modules had 0.80.1 while the lockfile said 0.75.3).

### Manual smoke checklist (run after every milestone)

- [ ] Cold start (splash → map renders)
- [ ] Map: markers render, **clustering** works (zoom out → clusters form)
- [ ] Map: tap marker → callout opens with corporation/POI details
- [ ] Drawer: open, navigate to each screen, active state correct
- [ ] Explore Nearby / Cities / Countries / Organisations: lists render, sort
- [ ] Search Name / Search Colours: results render
- [ ] Corporation details screen: colours, fencing, organisation, foundation
- [ ] Favourites: toggle city + corporation, force quit, relaunch → persisted
- [ ] Firebase Realtime Database: live update reflects (change a value in the
      Firebase console → app updates). Verify with `DATABASE_TYPE=prod`.
- [ ] App Check: token obtained (no App Check error dialog). Verify with
      `DATABASE_TYPE=prod`.
- [ ] Theme switch: light / dark / auto
- [ ] Language switch (if applicable in Settings)

### Known baseline issue (pre-existing, do NOT block on)

On 0.75.3, `yarn test` reports **32/32 tests pass** but 2 suites
(`__tests__/App.test.tsx`, `__tests__/Navigation-test.tsx`) fail to **compile**
under ts-jest with `TS2612` *inside `react-native-reanimated@3.16.0-nightly`
source* (`createAnimatedComponent.tsx:140`). Disabling ts-jest diagnostics
makes all 41 tests pass, so this is purely a type-check diagnostic on a
dependency's source, not a functional failure. The leftover `ts-jest.log`
(2024-09-27) shows the identical error — it predates this upgrade.

**Expected resolution:** bumping `react-native-reanimated` to 4.x (Milestone 4)
removes the old nightly source from the program. Do not patch this on 0.75.3.

---

## Milestone 0 — Preparation (no RN bump) ✅

**Goal:** establish a known-good 0.75.3 baseline.

- [x] `rm -rf node_modules && yarn install --immutable` (removed a stray, uncommitted
      0.80.1 in node_modules; restored committed 0.75.3 + React 18.3.1).
- [x] `yarn lint` green (0 errors, 1 pre-existing warning:
      `react/no-unstable-nested-components` in `CorporationList.tsx:172`).
- [x] `yarn build:ios` (JS bundle) succeeds. Metro 0.80.12.
- [x] Android JS bundle succeeds.
- [x] `pod install` resolves the iOS dependency graph (succeeded once before a
      stale-Pods cleanup; re-run hung on network — not a blocker).
- [x] `yarn test`: 32/32 pass; 2 suites fail to compile (pre-existing, see above).

**Still pending (tooling only, no RN bump) — defer into M1 if convenient:**
- [ ] Bump Ruby to **3.1+** (RN 0.76+ requires it; current is 2.7.6 via mise).
      Update `Gemfile` (`ruby ">= 3.1"`) and `.tool-versions`. Run `bundle install`.
- [ ] Bump Node to **20 LTS** (current `.nvmrc`/`.node-version` says 18.16;
      RN 0.85+ requires Node ≥20.19.4; mise has 20.19.4 available). Update
      `.nvmrc`, `.node-version`, and `.github/workflows/test.yml` (`node-version`
      is currently 16 — bump to 20).
- [x] Branch strategy: long-lived `upgrade/rn` branch created.

**Files to touch (tooling only):** `.nvmrc`, `.node-version`, `.tool-versions`,
`Gemfile`, `.github/workflows/test.yml`.

---

## Milestone 1 — 0.75 → 0.77 (New Architecture becomes default; stay legacy)

**Versions:** react-native `0.75.3` → `0.77.3` · react stays `18.3.1` (verified)

**Status: FULLY GREEN ✅ — Android `BUILD SUCCESSFUL`, iOS `BUILD SUCCEEDED`,
lint green, 32/32 tests pass.** Resolved during native build validation.

### JS-side changes

- [x] `package.json`: `react-native` 0.75.3→0.77.3; `@react-native/*` configs
      0.75.3→0.77.3; `@babel/core`→^7.25.2, `@babel/preset-env`→^7.25.3,
      `@babel/runtime`→^7.25.0; ADDED `@react-native-community/cli` +
      `cli-platform-android` + `cli-platform-ios` @15.0.1 (now explicit devDeps);
      REMOVED `babel-jest` (now transitive via jest preset).
- [x] `yarn install` resolves to react-native 0.77.3, react 18.3.1, Metro 0.81.5.
- [x] `yarn lint` green (same pre-existing warning).
- [x] `yarn test`: 32/32 pass; only the 2 pre-existing reanimated TS2612 suites
      (unchanged from 0.75.3 baseline — no new regressions). 7 snapshots updated
      for svg 15.x serialization (`strokeWidth="2"`→`{2}`, `fill` color payload).
- [x] iOS + Android JS bundles build.
- [x] **`jest.setup.ts` fix:** removed the
      `jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')` line —
      that path is GONE in 0.77 (the directory now has `NativeAnimatedModule.js` /
      `AnimatedMock.js`). RN 0.77's jest setup mocks `NativeAnimatedModule` directly
      in `node_modules/react-native/jest/setup.js`, so the legacy mock is obsolete.

### Native library bumps (required for RN 0.77 codegen — the big discovery)

The plan said "bump native libs only if the build breaks". The build broke on
**5 libraries** whose old versions use the pre-0.77 `ViewManager`/codegen API
(`BaseViewManagerInterface` removed in RN 0.77). Each library's docs only
support the **three latest RN minors**, so RN 0.77 is now outside the support
window of the current versions. Bumped to the minimum versions with explicit
"Support React Native 0.77" release notes (still legacy-arch compatible):

| Package | Was | Now (M1) | Why |
|---|---|---|---|
| `react-native-gesture-handler` | 2.19.0 | **2.22.1** | "Support RN 0.77" (Jan 2025) |
| `react-native-screens` | 3.34.0 | **3.36.0** | "Support for 0.77" (Feb 2025, 3.x/legacy) |
| `react-native-svg` | 13.6.0 | **15.11.2** | "react-native@0.77"; **15.11.0 had a packaging bug** (missing `scripts/rnsvg_utils.rb`) — use 15.11.2 |
| `react-native-safe-area-context` | 4.11.0 | **5.1.0** | "Fix compat with RN 0.77" (Jan 2025, major) |
| `react-native-reanimated` | 3.16.0-nightly | **3.17.5** | "Bump RN version to 0.77 stable" (Feb 2025, stays 3.x/legacy) |
| `@react-native-community/geolocation` | 3.0.4 | **3.4.0** | 3.0.4 pins `RCT-Folly (= 2021.07.22.00)`, incompatible with RN 0.77's Folly 2024.11.18.00 — 3.1.0+ dropped the pin |

**How to find 0.77-compatible versions** (reusable for M2/M3): each library's
GitHub release notes explicitly name the RN version, e.g. gesture-handler
2.22.0 "Support React Native 0.77". Search the releases API:
`curl api.github.com/repos/<org>/<repo>/releases | grep -A1 0.77`.

### Native-side changes (toolchain)

- [x] `android/build.gradle`: buildTools 34→35, minSdk 23→24, compileSdk 34→35,
      targetSdk 34→35, ndkVersion 26.1.10909125→27.1.12297006,
      kotlinVersion 1.9.24→2.0.21, KGP classpath 2.0.20→2.0.21.
- [x] `android/gradle/wrapper/gradle-wrapper.properties`: Gradle 8.8→8.10.2.
- [x] `android/gradle.properties`: **kept `newArchEnabled=false`** (per plan; the
      0.77 template flips this to `true` but we stay legacy in M1).
- [x] `android/app/.../MainApplication.kt`: `SoLoader.init(this, false)`→
      `SoLoader.init(this, OpenSourceMergedSoMapping)` + import
      `com.facebook.react.soloader.OpenSourceMergedSoMapping`.
- [x] `metro.config.js`: type import `metro-config`→`@react-native/metro-config`.
- [x] `Gemfile`: ADDED `gem 'xcodeproj', '< 1.26.0'` + `gem 'concurrent-ruby', '< 1.3.4'`.
  - [x] `Gemfile.lock`: `BUNDLED WITH` bumped 2.1.4→4.0.17 (old bundler crashed on
        Ruby 3.3). Run `gem install bundler` then `bundle install`.
- [x] `.tool-versions`: ruby 2.7.6→3.3, added `nodejs 20.19.4`.
- [x] `ios/Couleurbummel/AppDelegate.mm`: **kept as ObjC++** (no change). RN 0.77
      defaults new apps to Swift (`AppDelegate.swift`), but the ObjC++
      `RCTAppDelegate` API (`sourceURLForBridge:`, `bundleURL`) is still supported.
      Migrating to Swift is an OPTIONAL cleanup, not required for the upgrade.
- [x] `ios/Podfile`: no platform change (`platform :ios, min_ios_version_supported`
      auto-follows RN to 15.1; `CouleurbummelTests` target kept). **Added a
      `post_install` fmt/Xcode-26 patch** (see below).

### ⚠️ Xcode 26 + fmt 11.0.2 workaround (iOS build fix)

Xcode 26.6's stricter `consteval` breaks the `fmt` 11.0.2 shipped with RN < 0.83
(`call to consteval function 'fmt::basic_format_string' is not a constant
expression` in `fmt/format-inl.h`). The real fix (fmt >= 12.1.0, fmtlib/fmt#4065)
is backported to RN 0.83+ (facebook/react-native#56225). On RN 0.77 + Xcode 26,
we disable fmt's compile-time format-string checking in `ios/Podfile`
`post_install` (survives `pod install`; re-patches are idempotent):
```ruby
fmt_base = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')
if File.exist?(fmt_base)
  src = File.read(fmt_base)
  marker = 'patched for Xcode 26 consteval'
  unless src.include?(marker)
    src.gsub!('#  define FMT_USE_CONSTEVAL 1', "#  define FMT_USE_CONSTEVAL 0 // #{marker}")
    File.chmod(0o644, fmt_base)
    File.write(fmt_base, src)
  end
end
```
This workaround **drops at M6 (RN 0.83+)** where fmt 12.1.0 is the bundled version.

### Validation ✅

- [x] `yarn install --immutable` (clean reinstall fixed a stale-rnc-cli
      executable-bit issue from an interrupted earlier install).
- [x] `bundle install` (after `gem install bundler`; Gemfile.lock re-bundled 4.0.17).
- [x] `bundle exec pod install` — 93 pods, no conflicts (after geolocation bump
      fixed the RCT-Folly 2021-vs-2024 conflict). Hermes iOS binary download can
      stall on a slow connection; pre-fetch with curl if needed.
- [x] `cd android && ./gradlew :app:assembleDebug` — **BUILD SUCCESSFUL**.
- [x] `xcodebuild ... -sdk iphonesimulator build` — **BUILD SUCCEEDED** (after fmt patch).
- [ ] Full smoke checklist on a device/simulator — still pending (run the app).

---

## Milestone 2 — 0.77 → 0.79 (React 19 + Metro package exports) ✅

**Versions:** react-native `0.77.3` → `0.79.7` · react **18.3.1 → 19.0.0**

**⚠️ Plan correction:** the runbook assumed M2 stays on React 18.3, but
**RN 0.79 has peer dependency `react: ^19.0.0`** — the React 19 jump happens
here, not at M3. M2 therefore carried the React 19 core bump (react,
react-test-renderer, @types/react). The full JS cascade (@rneui 5, i18next 17/26,
RTL 14) was deferred via a **minimal-bump strategy**: only the hard React-19
requirements were bumped; @rneui rc.8, react-i18next 12, i18next 22, and
@testing-library/react-native 12.7.2 were kept (they tolerate React 19 — verified
via peer deps) and bumped only if they broke. None broke; tests pass.

**Status: FULLY GREEN ✅ — Android `BUILD SUCCESSFUL` (clean, 44s), iOS
`BUILD SUCCEEDED`, lint green, 32/32 tests pass.**

### JS-side changes

- [x] `package.json`: react 18.3.1→19.0.0, react-native 0.77.3→0.79.7,
      `@react-native/*` configs →0.79.7, CLI 15.0.1→18.0.0, `@types/react`→^19,
      `@types/react-test-renderer`→^19, react-test-renderer→19.0.0.
- [x] **Removed `@types/react-native`** (obsolete since RN 0.71 ships its own
      types); it pulled `@types/react@18.0.26` via `*`, causing a duplicate
      @types/react (18 + 19) that broke JSX component typing
      (`ReactElement not assignable to ReactNode`).
- [x] **Added `resolutions: { "@types/react": "^19.0.0" }`** to force a single
      @types/react across transitive pulls (@types/react-native-vector-icons,
      @types/react-test-renderer resolved @types/react via `*` → 18.0.26).
- [x] `yarn lint` green, `yarn test` 32/32, iOS+Android JS bundles build.

### Native library bumps (RN 0.79 codegen / Yoga / Fabric C++ API changes)

RN 0.79 changed the codegen `codegenNativeComponent` export (moved off root),
the Yoga `StyleLength` API, and the Fabric `ShadowViewMutation.parentShadowView`.
Several M1 lib versions broke and needed further bumps:

| Package | M1 → M2 | Why |
|---|---|---|
| `react-native-maps` | 1.18.0 → **1.26.0** | 1.18 `forwardRef` broke under React 19 (`restProps.mapRef is not a function`). 1.28+ import `codegenNativeComponent` from `react-native` root (removed in 0.79) — **1.26.0 is the last RN-0.79-compatible version** (uses deep-import path). |
| `react-native-map-clustering` | 3.4.2 → **4.0.0** | 3.4.2 clustering ref calls broke under React 19 (`range` undefined). 4.0.0 uses supercluster 8 (ESM). |
| `react-native-screens` | 3.36.0 → **4.12.0** | 3.36.0 (RN 0.77) fails on RN 0.79 Fabric `parentShadowView`. 3.x ends at 3.37.0 (RN 0.78 only) — **RN 0.79 requires screens 4.x**. 4.12.0 is the minimum with explicit RN 0.79 support; still legacy-arch compatible. |
| `react-native-safe-area-context` | 5.1.0 → **5.4.0** | 5.1.0 (RN 0.77) fails on RN 0.79 Yoga `StyleLength::unit`. 5.4.0 "Support React Native 0.79". |
| `react-native-country-flag` | 1.1.9 → **2.0.2** | 1.1.9 has no types; React 19 JSX inference broke it. 2.0.2 ships types. |

### `react-native-maps` deep imports — fixed (the predicted M2 risk)

maps 1.26.0 ships **TypeScript source** (`main: src/index.ts`); `lib/sharedTypes`
is gone. The 8 deep imports (`react-native-maps/lib/sharedTypes`) + 1 in
`__mocks__/` were changed to import from the package **root** (`react-native-maps`),
which re-exports `Region`/`LatLng`/`Point` via `export * from './sharedTypes'`.

### Jest config changes

- `jest.config.ts` `transformIgnorePatterns`: added `react-native-maps`,
  `react-native-map-clustering`, `supercluster`, `kdbush`, `@mapbox` (maps 1.26
  ships TS source; clustering 4.0 pulls ESM supercluster/kdbush that need babel).
- `jest.setup.ts`: added `jest.mock('react-native-maps/src/specs/NativeAirMapsModule')`
  — maps 1.26 calls `TurboModuleRegistry.getEnforcing('RNMapsAirModule')` at module
  load, which throws in jest; stubbing the spec module lets MapView render.
- Removed a temporary AggregateError-debug toString hack.

### Code change

- `src/components/Map.tsx`: `showsPointsOfInterest` → `showsPointsOfInterests`
  (maps 1.26 renamed the prop).

### Native toolchain (template diff 0.77→0.79)

- [x] `android/build.gradle`: targetSdk 34→35 (compile already 35 from M1).
- [x] `android/gradle/wrapper`: Gradle 8.10.2→8.13-bin.
- [x] `android/app/build.gradle`: `jscFlavor` → community JSC package
  (`io.github.react-native-community:jsc-android:2026004.+`); cosmetic (Hermes on).
- [x] `Gemfile`: added `bigdecimal`, `logger`, `benchmark`, `mutex_m`
  (Ruby 3.4 stdlib removal).
- [x] `.gitignore`: added `.kotlin/`.
- [x] `ios/Podfile` `post_install` fmt patch marker fixed (Ruby single-quote
      `#{marker}` doesn't interpolate — switched to double-quote string).
- [x] `AppDelegate.mm` kept as ObjC++ (0.79's Swift template uses a new
      `RCTReactNativeFactory` pattern, but ObjC `RCTAppDelegate` still supported).

### Snapshot updates

- 9 jest snapshots updated (benign churn): Map (maps 1.18 `AIRMap` → 1.26
  `RNMapsMapView` render differently in jest), CountryList (country-flag 2.0.2).

### Validation ✅

- [x] `yarn install`, `yarn lint`, `yarn test` (32/32), iOS+Android JS bundles.
- [x] `bundle exec pod install` (97 pods, fmt patch + safe-area 5.4 + screens 4.12).
- [x] `cd android && ./gradlew clean :app:assembleDebug` — BUILD SUCCESSFUL (44s).
- [x] `xcodebuild ... -sdk iphonesimulator build` — BUILD SUCCEEDED.
- [x] `npx react-native run-ios` build phase — BUILD SUCCEEDED (after fixing two
      env issues, see "iOS run-ios env fixes" below).
- [ ] Full smoke on device/simulator — still pending (run the app, esp. map
      clustering + Firebase live DB with `DATABASE_TYPE=prod`).

### iOS `run-ios` env fixes (do these once, machine-local)

`npx react-native run-ios` builds via the **default** Xcode DerivedData
(`~/Library/Developer/Xcode/DerivedData`), using a minimal shell that does NOT
load mise/asdf. Two machine-local fixes were needed (both gitignored):

1. **`ios/.xcode.env.local` — point at Node 20.** RN 0.79's codegen Run Script
   phase sources `ios/.xcode.env` then `.xcode.env.local` to find `NODE_BINARY`.
   Our `.xcode.env.local` hardcoded the stale asdf Node 18.16.0, which RN 0.79's
   codegen can't use. Set it to the mise Node 20:
   ```
   export NODE_BINARY=/Users/<you>/.local/share/mise/installs/node/20.19.4/bin/node
   ```
   (`.xcode.env.local` is gitignored — it's machine-specific. Verify with
   `node -v` in your mise shell and use that path.)

2. **Stale codegen script phase (12× `../` path bug).** If `xcodebuild` fails on
   `PhaseScriptExecution [CP-User] Generate Specs` (target `ReactCodegen`) with
   `No such file or directory` for `with-environment.sh`, the Pods project has a
   stale `ReactCodegen.podspec` script phase whose `RCT_SCRIPT_RN_DIR` resolves
   past the filesystem root (12× `../` instead of 1×). This happens when a
   previous `pod install` ran the codegen with a stale/missing output path.
   **Fix:** nuke all codegen + Pods + DerivedData and re-run pod install:
   ```
   rm -rf ios/Pods ios/Podfile.lock ios/build ~/Library/Developer/Xcode/DerivedData/Couleurbummel-*
   cd ios && bundle exec pod install
   ```
   Verify the regenerated `ios/build/generated/ios/ReactCodegen.podspec` has
   `RCT_SCRIPT_RN_DIR="$RCT_SCRIPT_POD_INSTALLATION_ROOT/../node_modules/react-native"`
   (1× `../`, not 12×).

These are environmental, not code changes — nothing to commit (`.xcode.env.local`
is gitignored). Documented here so the same fixes apply at M3+.

**Note on `@react-native-firebase/*`:** still on 20.5.0 — **worked fine** under
Metro 0.82 package exports (no resolution breakage). No bump needed at M2.

---

## Milestone 3 — 0.79 → 0.81 (React 19 + Android 16 + edge-to-edge)

**Versions:** react-native `0.79.7` → `0.81.6` · react `18.3.1` → `19.1.x`

This is the **JS dependency cascade milestone** — the first of the two one-way
doors. React 18 → 19 forces peer-dep bumps across the JS-only libraries.

### React 19 peer-dependency cascade (JS-only libs)

| Package | Current | Target | Notes |
|---|---|---|---|
| `react` | 18.3.1 | 19.1.x | Match RN 0.81's bundled React |
| `react-test-renderer` | 18.3.1 | 19.1.x | Must match `react` exactly |
| `@rneui/base` | 4.0.0-rc.8 | **5.0.0** (stable) | React 19 support; API changes — audit usages |
| `@rneui/themed` | 4.0.0-rc.8 | **5.0.0** | As above |
| `react-i18next` | 12.1.4 | 17.x | Major; check hook API |
| `i18next` | 22.4.6 | 26.x | Major |
| `@testing-library/react-native` | 12.7.2 | 14.x | React 19 peer; test API may shift |
| `@types/react` | 18.x | 19.x | |
| `@types/react-test-renderer` | 18.x | 19.x | |

**Native libs (can bump now or defer to M4 — but bumping here is fine if they
support React 19 + RN 0.81):** reanimated, screens, gesture-handler, svg,
safe-area-context, bootsplash. **Defer the New-Architecture versions to M4**
unless a lib requires a bump to compile on 0.81.

### Android 16 (API 36) + edge-to-edge

- compileSdk/targetSdk → **36** (per Upgrade Helper).
- Android 16 enforces **edge-to-edge**; RN 0.81 adds the `edgeToEdgeEnabled`
  gradle property. Set per Upgrade Helper.
- **Predictive back gesture** enabled by default for API 36. We use
  `@react-navigation/drawer` + `react-native-gesture-handler` — test back
  navigation thoroughly. If custom native back handling exists, migrate or
  temporarily opt out.
- **16 KB page size** requirement (Google Play, from Nov 2025) — RN is already
  compliant; ensure native libs are too.

### Built-in `SafeAreaView` deprecated (0.81)

We already use `react-native-safe-area-context` (verified: no `SafeAreaView`
imported from `react-native` in `src/`). ✅ Non-issue. Do not regress.

**Gate:** full validation gate. This is a big milestone — expect snapshot churn
from `@rneui` 5 and React 19. Update jest snapshots deliberately (review diffs).

---

## Milestone 4 — Enable New Architecture on 0.81 (no RN bump)

**Versions:** react-native stays `0.81.6` · react stays `19.1.x`

This is the **highest-risk milestone** and the RN team's recommended staging
point. Do not cross to 0.82 until this is fully green.

### Flip the flags

- `android/gradle.properties`: `newArchEnabled=true`
- iOS: `RCT_NEW_ARCH_ENABLED=1 bundle exec pod install` (clean Pods first)

### Bump all native libraries to New-Architecture-compatible versions

| Package | Current → M4 target | New Arch notes |
|---|---|---|
| `@react-native-firebase/*` | 20.5 → **26.x** | New Arch support landed v21+; v26 targets RN 0.79+ |
| `react-native-reanimated` | 3.16.0-nightly → **4.5.x** | New Arch ready; **resolves the TS2612 test issue** |
| `react-native-screens` | 3.34 → **4.26.x** | Major; New Arch default |
| `react-native-gesture-handler` | 2.19 → **3.1.x** | Major |
| `react-native-safe-area-context` | 4.11 → **5.8.x** | Major |
| `react-native-svg` | 13.6 → **15.x** | Major |
| `react-native-bootsplash` | 4.6 → **7.3.x** | Major |
| `@react-native-async-storage/async-storage` | 2.0 → **3.1.x** | Major |
| `react-native-maps` | 1.18 → **1.29.x** | New Arch + RN 0.76+ support |
| `react-native-map-clustering` | 3.4.2 → **4.0** | ⚠️ **highest risk** — thin wrapper over maps |
| `react-native-vector-icons` | 9.2 → **10.3.x** | Major |
| `react-native-localize` | 2.2 → **3.7.x** | Major |
| `react-native-popover-view` | 5.1 → **6.1.x** | Major |
| `react-native-element-dropdown` | 2.5 → **2.12.x** | Minor |
| `react-native-config` | 1.4.12 → **1.6.1** | Minor |
| `@react-native-community/geolocation` | 3.0.4 → **3.4.x** | Minor |

### ⚠️ `react-native-map-clustering` — resolve FIRST

This is the single biggest risk. It's a thin wrapper around `react-native-maps`
and may not have full New Architecture support. **Before flipping any flags:**
1. Check the map-clustering 4.0 changelog/issues for New Arch / Fabric support.
2. If it's not New-Arch-compatible, options: (a) apply an interop-layer patch,
   (b) fork & patch, (c) replace with a New-Arch-compatible alternative, or
   (d) implement clustering via `react-native-maps` directly + a JS clustering
   util.
3. Make the decision and land it before touching the other native deps.

### Interop layers

RN 0.82 keeps interop layers for backward-compatible 3P libs. If a library
fails under New Arch, the interop layer may let it limp through — but treat
that as a stopgap, not a fix. Surface warnings and file/patch as needed.

**Gate:** the most rigorous validation of the whole upgrade. Every smoke item,
especially: map clustering, callouts, drawer + gesture-handler, Firebase live
DB + App Check. The `yarn test` TS2612 failures should now be gone (reanimated 4).

---

## Milestone 5 — 0.81 → 0.82 (the one-way door)

**Versions:** react-native `0.81.6` → `0.82.1` · react `19.1.x` → `19.1.1`

Only attempt **after M4 is fully green.** 0.82 makes the New Architecture the
*only* architecture — `newArchEnabled=false` is ignored, and
`RCT_NEW_ARCH_ENABLED=0` is ignored.

**Key changes:**
- **Legacy Architecture classes remain** (not removed yet) — so interop-layer
  libs keep working. Removal starts in 0.83+.
- **React 19.1.1**: owner stacks now fully work with the RN babel preset
  (`@babel/plugin-transform-function-name` no longer breaks them).
- **DOM Node APIs**: native component refs now expose DOM-like nodes
  (`parentNode`, `getBoundingClientRect`, etc.) alongside legacy `measure`.
  We don't appear to use `setNativeProps` or deep ref APIs — low risk. Audit
  `src/` for `ref.current.measure` / `setNativeProps` and confirm.
- **Experimental Hermes V1** opt-in available (do not enable yet — M6/0.84).

**Gate:** full validation gate. If any legacy-arch-only behavior was lurking,
this is where it surfaces.

---

## Milestone 6 — 0.82 → 0.86 (finish line: Jest preset, absoluteFillObject, Hermes V1, Node)

**Versions:** react-native `0.82.1` → `0.86.2` · react `19.1.1` → `19.2.x`

This spans 0.83 (no breaking changes), 0.84 (Hermes V1 default), 0.85 (Jest
preset split + Node + absoluteFillObject removal), 0.86 (no breaking changes).
Apply via Upgrade Helper `0.82.1` → `0.86.2`.

### 0.85 breaking changes (act here)

1. **Jest preset moved to `@react-native/jest-preset`.** One-line change in
   `jest.config.ts`:
   ```diff
   - preset: 'react-native',
   + preset: '@react-native/jest-preset',
   ```
   Add `@react-native/jest-preset` to devDependencies (matches RN 0.86.2 →
   `@react-native/jest-preset@0.86.2`). Verify the preset still works with our
   ts-jest `transform` config and `jest.setup.ts`.

2. **`StyleSheet.absoluteFillObject` removed.** We use it in 3 places:
   ```
   src/components/Map.tsx:48
   src/components/Map.tsx:53
   src/components/map/AddressMarker.tsx:181
   ```
   Replace each `...StyleSheet.absoluteFillObject` with `...StyleSheet.absoluteFill`
   (a style object, equivalent for spread). Verify visually that the map + markers
   still fill correctly.

3. **Node ≥ 20.19.4** required (done in M0; just verify). Node 21/23 are EOL.

### 0.84 — Hermes V1 by default

- Hermes V1 becomes the default engine (new bytecode). **Clear caches:**
  `rm -rf $TMPDIR/metro-* $TMPDIR/haste-map-*` and `cd android && ./gradlew clean`
  and `cd ios && rm -rf build Pods && bundle exec pod install`.
- Do NOT enable the experimental Hermes V1 flag from 0.82 (that was the opt-in);
  0.84 ships it as default. Just build and verify.

### 0.83, 0.86 — no breaking changes

Low effort. Apply the Upgrade Helper diff (mostly version bumps + minor native
file tweaks).

**Gate:** full validation gate + a fresh app store / Play Store release build
(`yarn build:ios`, `yarn android:release`) to confirm release builds work, not
just debug.

---

## Appendix: key sources

- React Native blog (per-version posts): https://reactnative.dev/blog
- Upgrade Helper: https://react-native-community.github.io/upgrade-helper/
- Upgrading docs: https://reactnative.dev/docs/upgrading
- New Architecture: https://reactnative.dev/architecture/landing-page
- 0.82 "A New Era" (the one-way door): https://reactnative.dev/blog/2025/10/08/react-native-0.82
- 0.80 (React 19 + exports + legacy freeze): https://reactnative.dev/blog/2025/06/12/react-native-0.80
- 0.79 (Metro exports + Firebase warning): https://reactnative.dev/blog/2025/04/08/react-native-0.79
- 0.81 (Android 16 + SafeAreaView deprecation): https://reactnative.dev/blog/2025/08/12/react-native-0.81
- 0.85 (Jest preset + absoluteFillObject + Node): https://reactnative.dev/blog/2026/04/07/react-native-0.85
- 0.86 (no breaking changes): https://reactnative.dev/blog/2026/06/11/react-native-0.86

## Appendix: current toolchain (commit baseline)

- react-native 0.75.3, react 18.3.1, react-test-renderer 18.3.1, Hermes on
- `newArchEnabled=false` (android/gradle.properties)
- Metro 0.80.12, TypeScript 5.6.2, Yarn 3.6.4 (Berry)
- Android: minSdk 23, compileSdk/targetSdk 34, Kotlin 1.9.24 / KGP 2.0.20, Gradle 8.8
- iOS: `platform :ios, min_ios_version_supported` (~13.1 on 0.75)
- Ruby 2.7.6 (mise), Node 18.16 (`.nvmrc`), JDK 17, Xcode 26.6, CocoaPods 1.17
- CI: `.github/workflows/test.yml` runs on `node-version: 16` (must bump to 20)
