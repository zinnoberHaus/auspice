# Third-party notices

Auspice's source license does not replace the licenses of its dependencies.

The website uses the design source's five font families under the SIL Open Font License 1.1. `next/font` downloads fonts during the build and serves them from Auspice's own assets; visitors do not request font files from Google. The social preview also bundles the unmodified Libre Caslon Display font in `public/fonts/Libre-Caslon-Display-Regular.ttf`.

| Family | Upstream source | Copyright notice and license |
| --- | --- | --- |
| Libre Caslon Display | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/librecaslondisplay) | [OFL](public/licenses/Libre-Caslon-Display-OFL.txt) |
| Libre Caslon Text | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/librecaslontext) | [OFL](public/licenses/Libre-Caslon-Text-OFL.txt) |
| Hanken Grotesk | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/hankengrotesk) | [OFL](public/licenses/Hanken-Grotesk-OFL.txt) |
| IBM Plex Mono | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/ibmplexmono) | [OFL](public/licenses/IBM-Plex-Mono-OFL.txt) |
| Noto Serif TC | [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoseriftc) | [OFL](public/licenses/Noto-Serif-TC-OFL.txt) |

Each notice is also available at its corresponding `/licenses/` URL on the deployed website. The previous design used [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans); its [OFL notice](public/licenses/DM-Sans-OFL.txt) remains for historical distributions.

The macOS preview includes Electron and Chromium. Their exact distributed notices, and Auspice's Apache-2.0 license, are retained inside the application bundle's Resources directory. See `desktop/` packaging instructions and verification evidence.

Dependency versions and upstream package locations are captured in the npm lockfiles. See [dependency observations](docs/operations/dependencies.md) for the unused Auth UI dependency chain, native image tooling, and redistribution limitations. No third-party tarot illustrations or translations were copied into this release.
