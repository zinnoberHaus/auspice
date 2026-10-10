# Dependency and license observations

Observed October 10, 2026 against the committed npm lockfiles. Auspice's own source is Apache-2.0; upstream packages retain their own licenses. This record is a technical inventory, not a completed legal audit or a blanket claim that every dependency is permissively licensed.

`npm audit --omit=dev --audit-level=high` for the web app and the full desktop `npm audit` reported zero known vulnerabilities at verification time. CI checks both lockfiles. Upgrade decisions still require behavioral and package checks.

The web installation contains `@triplit/client` (AGPL-3.0-only), its related packages with incomplete npm license metadata, and `ua-parser-js@2.0.10` (AGPL-3.0-or-later). `npm explain` traces these to the unused `@neondatabase/auth-ui` dependency of the Auth SDK. Auspice implements its own account interface and imports the SDK's `next` and `next/server` entry points. The checked production Next output traces did not reference `@triplit`, `@neondatabase/auth-ui`, or the top-level `ua-parser-js` package. Next itself contains a separately vendored, MIT-licensed `ua-parser-js` implementation; a textual match on that name alone does not identify the AGPL package.

Do not redistribute the whole development `node_modules` tree as if it were Apache-only. Recheck these traces and upstream terms before importing Auth UI, changing SDK entry points, producing a standalone server distribution or shipping bundled dependencies. See the [Auth SDK package manifest](https://github.com/neondatabase/neon-js/tree/main/packages/auth) and [UAParser upstream license](https://github.com/faisalman/ua-parser-js/blob/master/LICENSE.md).

Sharp's prebuilt libvips packages include LGPL-3.0-or-later components and additional notices. The desktop uses Sharp only to produce the application icon; it is not included in the desktop ASAR. The web's Next image tooling may use its own installed Sharp/libvips. Preserve the upstream notices and investigate corresponding-source/relinking obligations before distributing those native libraries in another form. Do not infer redistribution clearance from a successful vulnerability scan.

Electron/Chromium and the native shell require their own notices in the desktop archive. Package verification and remaining distribution limits are recorded in [desktop operations](desktop.md).
