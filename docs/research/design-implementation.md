# Supplied almanac design

Source imported October 10, 2026: `Auspice_ Holistic Divination App (1).zip`, SHA-256 `e7256cdde32c9cbd117601d5932b592fdddc9d1968d71c623c0fec8d123bc712`. The replacement archive was readable. Its eleven HTML documents, two window components, support script and thumbnail were inspected privately. The first archive remains a separate, unsuccessful access attempt.

The implementation adopts the supplied modern almanac direction: paper `#F3EEE4`, ink `#1D1B17`, cinnabar `#B3361F`, seal tint `#F2DDD3`, hairlines `#D8CFBE`, wood `#4F6B45`, earth `#A57C35`, and water `#2D4560`. Typography uses Libre Caslon Display, Libre Caslon Text, Hanken Grotesk, IBM Plex Mono and Noto Serif TC. Fonts are served by the application, with OFL notices. The design's window mockups and support runtime are not shipped as application code.

## Screen mapping

| Supplied screen | Working adaptation | Boundary |
| --- | --- | --- |
| Today | Current local date, ruled almanac layout, real random guest card, tradition navigation, journal and planning links | Daily text is explicitly a reflection prompt. No fabricated lunar events, day officers, good hours or personal directions. |
| Sidebar | Seal identity, ask action, Today, journal, life planners, five reading modes, guides, account, night mode | Only implemented destinations appear. Command/Ctrl-K opens a question; mobile navigation keeps its focus trap and dismissal controls. |
| Tarot / TarotCard | One-card, three-card and ten-card Celtic Cross guest spreads, individual reveal/selection, position and card meanings | All 78 cards are available, without repetition within a spread. Guest spreads are upright and unsaved. A personal interpretation draws its own separate symbols. |
| Reading | Printed-almanac typography and colors applied to actual symbols, summary, sections, practice and private notes | No invented council agreement percentage, dated verdict or guarantee. Existing server authentication, allowance, ownership and replay handling are retained. |
| HomeFinder | One to three user-entered homes, practical checklists, comparison notes, entry-aligned reflection grid, transfer into a feng shui question | No listing search, manufactured scores, measured compass bearings, Vastu or Flying Star calculation. Drafts stay in page memory and are not synchronized. |
| DatePicker | Real month navigation, date selection, event and intention fields, calendar-file export in a browser, transfer into a reflection | A planning aid, not an auspicious-date calculator. Calendar files are local downloads. Existing desktop packages restrict this export; use File → Open in browser. |
| NatalChart | Existing approximate sun-sign reflection in the new visual system | The prototype's literal planetary placements, ascendant and transits are not a working ephemeris and are not published as real results. Full natal charts remain unavailable. |
| DesktopStudio | Night palette for the working application; defaults to night in Electron unless a theme preference was saved | No fabricated future-cycle timeline. The existing desktop wrapper receives the web redesign; its native distribution status is unchanged. |
| DesktopAmbient | Existing desktop access to the same question and journal flows | Menu-bar widgets, global shortcuts and good-hour notifications are not implemented by this change. |

The sample Mira/Jun profiles, listings, chart positions, scores, transits and dates in the source are authored fixtures. They are not customer records or verified calculations. None are imported into live account data. No database migration, billing activation or provider access change is part of the design import.

## Verification and recovery

Automated checks cover guest spread sizes and uniqueness, rejection of unexpected spread parameters, calendar/date handling, calendar-file escaping, and bounded transfer into a reading. Calendar export follows [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545) for text escaping, UTF-8 line folding and the exclusive end of an all-day event. Existing reading/account/security tests remain part of the required suite. Record build, deployment and HTTP results in the PR and release evidence.

Source and thumbnail inspection establish the design direction; they do not substitute for a rendered desktop/mobile comparison. No browser was connected when this change began. Browser interaction, keyboard and device visual verification must be recorded separately if access becomes available. Production sign-in still depends on the provider's trusted-domain correction documented in the deployment runbook.

Recovery is an application deployment rollback to the preceding verified source. There is no schema change to reverse. Planner drafts and guest card tables are intentionally ephemeral; leaving or reloading the application clears them. The theme preference is the only new browser-storage value.
