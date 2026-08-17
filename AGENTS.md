# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **`albyhub-startos` depends on this package** and imports the `manifest` export from `startos/manifest`, plus `apiHostId`/`apiInterfaceId` from `startos/interfaces.ts`. Treat those three as a public API: renaming one is a cross-repo change.
- **phoenixd owns `phoenix.conf` — don't model or template it.** It generates the file on first start, including the `http-password`. A `FileHelper` over it would fight the daemon for ownership and could clobber a live credential.
- **The `main` volume is a wallet**, holding `seed.dat` and the channel database. Channel balances are not recoverable from the seed alone, so never exclude anything from the backup and never suggest running a restored copy alongside the original.
- **The `chown` oneshot is required** — the image runs as `phoenix` and the volume arrives root-owned.
- **No local Bitcoin node.** Channels are managed by ACINQ's LSP; don't add bitcoind as a dependency or imply one is needed.
