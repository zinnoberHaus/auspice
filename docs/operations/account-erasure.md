# Account erasure decision

Observed October 10, 2026 against the provisioned Managed Better Auth instance and `@neondatabase/auth@0.5.0-beta`.

The SDK documents `deleteUser`, but the deployed provider returned HTTP 404 `Not Found` for `delete-user` in a synthetic account test. A working settings UI must not report a successful deletion when this occurs. The alternative Neon management API requires an additional privileged API key that the app does not hold.

The application therefore checks a fresh provider session, requires the explicit `DELETE` confirmation, and reauthenticates the same session email/password through the provider's supported sign-in endpoint. It verifies the returned identity UUID matches the session UUID. Only then does a parameterized server-side SQL statement delete that identity from `neon_auth."user"`. The provider's existing foreign keys remove credentials and sessions; migration 002 links all application-owned user data with `ON DELETE CASCADE`. No password hashes are read, copied or verified by application code, and a request body cannot nominate a target identity.

This is an explicit dependency on the managed schema, not a claim that Neon's unsupported self-service endpoint works. Changes to the provider schema or permissions must trigger a deletion regression test. Prefer the provider self-service deletion endpoint when it becomes available and passes the same erasure tests. The architecture is consistent with Neon's documented [database-resident identity model](https://neon.com/blog/neon-auth-branchable-identity-in-your-database); the direct-delete fallback itself is an application decision.

Verification covers a real synthetic account, password reauthentication, identity disappearance, private-data cascade, prevention of orphan writes, and preservation of a different account. Backups and already-running external interpretation requests have independent lifecycles; deletion cannot retroactively remove data already transmitted to a processor. The production privacy policy describes backup retention limits without inventing a retention period.
