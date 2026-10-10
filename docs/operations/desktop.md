# Auspice desktop operations

The desktop app is a macOS shell for the live web sanctuary at `https://auspice-red.vercel.app`. Its own native menu supports reconnect, zoom, edit operations, help, and opening the site in a browser. It does not run a local reading model or store an offline journal. Reading, account, and journal changes use the same server-side services as the web app. An internet connection is required.

## Build and artifacts

Run from the repository:

```sh
npm ci
cd desktop
npm ci
npm audit
npm run package
```

The default package command builds separate Apple Silicon (`arm64`) and Intel (`x64`) ZIP archives, without publishing. `npm run package:arm64` and `npm run package:x64` build one architecture. Build outputs are under ignored `release/`; do not check application binaries, packaged dependencies, private account data, or credentials into the repository.

- `release/Auspice-0.1.0-mac-arm64.zip`
- `release/Auspice-0.1.0-mac-x64.zip`
- Expanded apps: `release/mac-arm64/Auspice.app` and `release/mac/Auspice.app`.

macOS 13 Ventura or later is required by Electron 44. [Electron 44 release notes](https://www.electronjs.org/blog/electron-44-0). The current build uses Electron 44.7.0 and electron-builder 26.15.3, pinned in the desktop lockfile. These versions were verified against npm on October 10, 2026.

The `after-pack.cjs` hook preserves the root Apache-2.0 license plus Electron MIT and Chromium third-party notices inside `Contents/Resources` before signing. Electron notices come from the exact official distribution archive verified against the installed Electron package checksums; the default upstream macOS archive stores them outside the app bundle.

The desktop icon is a direct raster/ICNS conversion of `app/icon.svg`. To regenerate it on macOS, run `npm run icon` within `desktop/`; this uses pinned sharp 0.35.5 and Apple's `iconutil`. Generated `desktop/assets/icon.png` and `icon.icns` are checked-in brand resources, not downloaded third-party imagery.

## Distribution limit

**These are previews with ad-hoc signatures, not Developer ID signed or notarized releases.** `identity: "-"` lets macOS validate local bundle integrity, but establishes no publisher identity or notarization trust. Gatekeeper may block a downloaded copy. Do not advertise these builds as a verified general-public installation path, do not instruct users to disable Gatekeeper, and do not strip quarantine attributes. No Apple signing credentials were available for this build. A clearly labelled developer-preview prerelease may distribute these artifacts with this limitation and the unverified native-runtime status stated prominently; it is not a production installer release.

Before general-public production desktop distribution:

1. Configure the authorized Apple Developer ID identity and notarization credentials outside source control; remove preview-only `identity: "-"` and `notarize: false` overrides.
2. Rebuild and verify nested signatures, notarization acceptance, and the stapled ticket on both archives.
3. Test installation from a downloaded/quarantined copy on clean supported macOS systems.
4. Verify sign-in, sign-out, cold-restart session persistence, Keychain behavior, all reading modes, journal notes, the JSON export save dialog, and reconnect after a real connectivity loss.
5. Publish the approved artifacts and their newly calculated checksums. There is no automatic update client in this version; replacing the application bundle is the update process.

Windows and Linux target placeholders remain in build configuration, but no installer for either platform is built or verified by this work.

## Boundaries

The main process follows [Electron's security guidance](https://www.electronjs.org/docs/latest/tutorial/security): all remote content uses the pinned HTTPS origin; Node integration is disabled in the main renderer, workers, and subframes; context isolation, sandboxing, and web security remain enabled. No preload, IPC bridge, filesystem bridge, or privileged API is exposed to web content. Permissions and device requests are denied, child-frame navigation is blocked, and webviews cannot attach.

Navigation checks reject credentials, other ports/origins, non-HTTPS URLs, and `blob:` URLs even when their embedded origin resembles the site. Server redirects are cancelled if they leave the app and never launch an external program. Approved source links may open in the default browser; `navigation.cjs` enumerates current cited source origins and the product's exact GitHub repository path. New source domains need an explicit policy update and rebuilt desktop package. Unknown destinations are not silently trusted.

The only supported download is an `application/json` response from the exact authenticated `/api/account/export` route, with every redirect remaining that exact endpoint. Electron presents an OS save dialog. Downloads from any other endpoint or origin are cancelled, and downloaded content is never executed or opened automatically.

The offline page uses the single `auspice://offline/` URL. Its handler only serves fixed bundled HTML for GET/HEAD, with restrictive CSP and no path-to-filesystem mapping. It has no remote dependencies or scripts. [Electron custom protocol reference](https://www.electronjs.org/docs/latest/api/protocol).

Packaged fuses disable RunAsNode, Node environment options, Node CLI inspection, and additional `file:` privileges. ASAR integrity validation and ASAR-only app loading are enabled. Cookie encryption is enabled; correct macOS Keychain/session behavior still requires signed-release runtime testing. Fuse settings and ad-hoc signing are defense layers, not proof against every attack. [Electron fuse reference](https://www.electronjs.org/docs/latest/tutorial/fuses).

## Dependency evidence and checks

The first scaffold used Electron 38.8.6 and had known advisories. Electron and builder were upgraded. Builder's transitive `@electron/get` dependency still requested global-agent 3, pulling in the vulnerable sprintf-js chain. The desktop manifest overrides global-agent to 4.1.3; upstream retains the `bootstrap()` entry point used by `@electron/get`. The bootstrap smoke check and real Electron download/package operations completed. [Upstream global-agent API](https://github.com/gajus/global-agent#setup-proxy-using-bootstrap-routine).

Pinning the icon renderer to sharp 0.35.5 fixes the libheif/librsvg advisories affecting earlier 0.35 releases. `npm audit` within `desktop/` currently reports zero known vulnerabilities. An audit result is time-specific and does not establish absence of all vulnerabilities; run it for each release.

`npx tsx --test tests/desktop.test.ts` from the root exercises origin parsing, offline URL rejection, external links, download allowlisting, and the actual main-process handler wiring using mocked Electron event boundaries. Eight tests pass. These checks do not replace real Chromium/native app testing.

Inspect the built bundle after packaging:

```sh
codesign --verify --deep --strict --verbose=2 release/mac-arm64/Auspice.app
codesign --display --verbose=4 release/mac-arm64/Auspice.app
shasum -a 256 release/Auspice-0.1.0-mac-arm64.zip release/Auspice-0.1.0-mac-x64.zip
```

`npm run verify:package` within `desktop/` performs the package checks and writes ignored `release/verification.json` and `release/SHA256SUMS`. It checks both archives, CPU architecture, minimum OS, notices, and packaged source against the current files.

Use the installed `@electron/fuses` API to inspect the actual executable's fuse bytes, and inspect `app.asar` to confirm only the main script, navigation policy, offline document, and package metadata are included. Preserve runtime and package evidence in the release record; a successful build alone does not prove the desktop product complete.

## Recovery and data

A web deployment changes the remote application without changing the shell. Recover a web regression by rolling back the verified Vercel deployment; the existing desktop shell will reconnect to the same pinned origin. Recover a shell regression by replacing the application bundle with a previously verified compatible version. Do not roll back to a release that turns off cookie encryption after encrypted cookies have been written, because Electron documents that transition as one-way.

The desktop shell does not hold a separate journal database: authoritative readings and notes remain on the service. Replacing the app bundle does not intentionally delete user data or revoke sessions. Users can export their journal and manage account deletion through the account interface. Sign-out uses the server's account session flow. Do not erase macOS application support or Keychain entries as routine upgrade cleanup.

## Native validation status

On October 10, 2026, two `cua.getApp` attempts for the built Apple Silicon app returned “Computer Use permissions are still pending” for macOS Accessibility and Screen Recording. No application state or screenshot was returned. The pending system permission was not bypassed, and no native launch, visual layout, actual account flow, download dialog, or cookie-persistence result is claimed. Browser discovery also returned no connected browser. Package and mocked handler verification remain separate from native runtime verification.
