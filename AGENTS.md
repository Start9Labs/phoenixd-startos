# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`albyhub-startos` depends on this package** and imports the `manifest` export from `startos/manifest`, plus `apiHostId`/`apiInterfaceId` from `startos/interfaces.ts`. Treat those three as a public API: renaming one is a cross-repo change. Going the other way, this package imports host ids and ports from `electrs-startos` and `fulcrum-startos` — scalars only, so nothing of theirs ships in the s9pk. It also reads `http-password` straight out of `phoenix.conf` on the mounted volume — so that key stays in that file under that name, whoever wrote it.
- **`phoenix.conf`'s model must never let a value reach the serializer as `undefined`.** `FileHelper.env` in start-sdk 2.0.9 has no `filterUndefined`, so such a key lands on disk as the literal string `undefined` and phoenixd fails to parse it on the next boot. The `onWrite` transformer in `startos/fileModels/phoenix.conf.ts` is what prevents that. Start9Labs/start-technologies#3874 fixes it in the SDK — drop the transformer when this package moves to a release carrying that fix, not before.
- **`electrum-server` is derived, never typed straight into `phoenix.conf`.** The user's choice is StartOS state in `store.json`; `init/watchChainSource.ts` resolves it to an address. Resolve an indexer's **TLS** bridge address (`ssl: true`) — phoenixd hardcodes `TLS.TRUSTED_CERTIFICATES()` and cannot speak to the plaintext bridge port.
- **The `trust-startos-ca` oneshot is what makes an on-server indexer reachable at all**, by putting this server's root CA where phoenixd's rustls looks (`/etc/ssl/certs/ca-certificates.crt`). Remove it and every non-public chain source fails its TLS handshake.
- **`getRootCa` in `startos/utils.ts` is a stand-in for `sdk.getRootCa`**, which lands in start-sdk 2.0.10. Delete it for the SDK call when this package moves to that release.
- **The `node` health check stringifies its i18n params.** `setupI18n` in start-sdk 2.0.9 formats a number through `Intl` on a locale derived from `LANG`, which is `C.UTF-8` in a service container and makes `Intl` throw — the check reads as failing. Fixed in start-sdk 2.0.10; pass numbers again once this package is on it.
- **Keep the shape's `.catchall(z.string())`.** phoenixd appends `http-password-limited-access` and `webhook-secret` to the same file, and a shape that dropped unknown keys would delete them on the next write.
- **A conf key that changes daemon behavior belongs in the reactive read in `main.ts`.** phoenixd parses the file only at startup, so a key an action can write but `main.ts` does not watch takes effect at some unrelated later restart.
- **`seed.dat` is phoenixd's.** Don't model it, and don't add an action that reads it out.
- **The `main` volume is a wallet**, holding `seed.dat` and the channel database. Channel balances are not recoverable from the seed alone, so never exclude anything from the backup and never suggest running a restored copy alongside the original.
- **The `chown` oneshot is required** — the image runs as `phoenix` and the volume arrives root-owned.
- **No local Bitcoin node.** Channels are managed by ACINQ's LSP; don't add bitcoind as a dependency or imply one is needed.
