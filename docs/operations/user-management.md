# User management

The operator console is `/admin`. It provides a 20-account paginated directory, search by email or name, account suspension with a reason and duration, restoration of access, and revocation of all sessions for an account. It displays identity and access metadata only. Journal entries, questions, readings, notes, passwords, and session tokens are not included.

## Owner activation is pending

No owner account was selected and no administrator role was granted during implementation. The operator must identify the intended owner's existing, email-verified Auspice account and its exact UUID before granting access. This is an application role, separate from a Neon organization/team role. Do not infer the owner from the first account, an email domain, or a project name.

Neon's documented bootstrap path is **Neon Console → project → branch → Auth → Users → account menu → Make admin**. Its SDK administration APIs require an existing administrator, so `auth.admin.setRole` is not the first-admin bootstrap mechanism. See the [Neon Admin guide](https://neon.com/docs/auth/guides/plugins/admin#prerequisites).

Alternatively, the checked-in script uses the documented [branch-scoped user-role management endpoint](https://api-docs.neon.tech/reference/updateneonauthuserrole). It requires an authorized Neon management API key supplied as `NEON_API_KEY`, explicit project and branch IDs, and an explicit user UUID repeated in the confirmation option. It does not inspect stored credentials, read environment files, create API keys, create users, or guess an owner. The grant replaces the role list with `["admin"]`.

```sh
node scripts/grant-admin.mjs \
  --project-id YOUR_PROJECT_ID \
  --branch-id YOUR_BRANCH_ID \
  --user-id YOUR_VERIFIED_USER_UUID \
  --dry-run
```

After checking the target account in Neon Console, securely provide `NEON_API_KEY` in the environment and run:

```sh
node scripts/grant-admin.mjs \
  --project-id YOUR_PROJECT_ID \
  --branch-id YOUR_BRANCH_ID \
  --user-id YOUR_VERIFIED_USER_UUID \
  --confirm YOUR_VERIFIED_USER_UUID
```

Do not paste a key into the command, repository, or logs. The script never prints credentials or provider response bodies and does not retry ambiguous network failures automatically. A successful response means the management API accepted the update; sign out, sign back in, and verify `/admin` separately. [Neon API authentication](https://api-docs.neon.tech/reference/authentication) uses a management API key, not an Auspice session cookie or the session-signing secret.

## Authorization and operations

Every page/API request verifies a fresh provider session and then reads the current role, ban flag, and email-verification state from `neon_auth."user"`. The user must be verified, unbanned, and have the exact `admin` role. A cached claim that someone was previously an administrator does not authorize access. `@neondatabase/auth@0.5.0-beta` checks `disableCookieCache === "true"` internally while exposing inherited boolean types; `lib/admin.ts` explicitly passes the required runtime string. Recheck this workaround when updating that dependency.

Directory and mutation responses use `Cache-Control: private, no-store`. Each mutation requires a matching Origin header, a valid target UUID, bounded input, and an explicit confirmation flag. The console prevents self-suspension and does not suspend other administrator accounts. Role changes, administrator recovery, and account deletion are intentionally handled through their dedicated workflows.

The operations use the installed SDK's `auth.admin.listUsers`, `banUser`, `unbanUser`, and `revokeUserSessions`, also documented in the [Neon Next.js server reference](https://neon.com/docs/auth/reference/nextjs-server) and the [Neon Admin guide](https://neon.com/docs/auth/guides/plugins/admin). Suspending access revokes existing sessions and blocks sign-in; lifting a suspension allows a new sign-in without restoring revoked sessions. Session revocation alone allows the account holder to sign in again. These behaviors are described in the [Better Auth Admin documentation](https://better-auth.com/docs/plugins/admin).

Suspension reasons may be shown to the affected account holder. Use factual, minimal reasons and keep private support conversations out of them. Successful mutations emit a structured `admin_account_action` application log containing actor UUID, target UUID, action, and timestamp. This is an operational log, not a tamper-proof audit trail; retention follows the deployment's log settings.

Other application routes currently use the shared one-second session cache. Their revocation visibility follows that configuration, and already-running requests may finish. Administrator routes bypass that cookie cache on every request. Changes to this shared session behavior belong in the authentication implementation and must be verified across all account flows.

## Verification and recovery

`npm test` includes mocked route tests for anonymous/non-admin access, fresh role checks, input/Origin validation, result-field projection, target protections, and each SDK mutation. Script tests exercise dry-run and explicit confirmation with an injected request function. These tests never contact a provider or modify real accounts.

Production administrator operations remain unverified until an owner account is explicitly granted the role and a designated test account is available. Verification should confirm directory pagination/search and suspension, restoration, and revocation on that designated account. Do not use customer accounts for smoke tests.

For a mistaken suspension, another authorized administrator can restore access in `/admin`; the affected user must then sign in again. For a mistaken administrator grant or operator lockout, use Neon Console's user-role controls to restore the intended role assignment. Verify access afresh afterward. Administrator recovery is a project-owner operation and cannot depend on the locked-out application account.
