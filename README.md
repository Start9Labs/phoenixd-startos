<p align="center">
  <img src="icon.png" alt="phoenixd Logo" width="21%">
</p>

# phoenixd on StartOS

> Everything not listed in this document should behave the same as upstream
> phoenixd. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[phoenixd](https://github.com/ACINQ/phoenixd/) is ACINQ's server-side Lightning wallet: it runs a node that manages its own channels through ACINQ's LSP, so there is no channel management to do and no separate Bitcoin node to run. This package runs it and exposes its HTTP API.

- **Upstream repo:** <https://github.com/ACINQ/phoenixd/>
- **Wrapper repo:** <https://github.com/Start9-Community/phoenixd-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, consumed unmodified.

| Property      | Value                      |
| ------------- | -------------------------- |
| Image         | `acinq/phoenixd`           |
| Architectures | x86_64, aarch64            |
| Command       | The image's own entrypoint |

| Subcontainer   | Purpose                                  |
| -------------- | ---------------------------------------- |
| `phoenixd-sub` | The only daemon — the one to `attach` to |

One oneshot runs first, giving the data directory to the unprivileged user the image runs as.

## Volume and Data Layout

One volume, and it is a wallet.

| Volume | Mount Point         | Purpose                            |
| ------ | ------------------- | ---------------------------------- |
| `main` | `/phoenix/.phoenix` | The seed, the channels, the config |

| Path           | Written by | Holds                                         |
| -------------- | ---------- | --------------------------------------------- |
| `seed.dat`     | phoenixd   | The wallet seed                               |
| `phoenix.conf` | phoenixd   | The configuration, including the API password |
| _database_     | phoenixd   | Channel state and payment history             |

**This volume is the wallet.** The seed is generated on first start and written here, and channel state is here too — so losing it without a backup loses funds, and copying it copies the wallet.

**Channel state is not recoverable from the seed alone.** A seed restores what is on-chain; the balance in open channels depends on the database, which is why the whole volume matters rather than just the twelve words.

## File Models

**None.** phoenixd owns its configuration entirely: it generates `phoenix.conf` on first start — including the API password — and the package does not model, template, or override it.

That has a practical consequence: **the password is not surfaced anywhere in StartOS.** It is read out of the configuration file from the service's terminal, and so is the seed.

## Dependencies

None — and that is the point of phoenixd.

**There is no Bitcoin node here.** Channels are opened and managed by ACINQ's Lightning service provider, which is a third party you are trusting for liquidity and channel management. That is a genuine trade against running your own node, and it is the reason phoenixd is small enough to run without any of the usual Lightning infrastructure.

It needs internet to reach that provider and the Lightning network.

## Network Access and Interfaces

One interface, and no web page behind it.

| Interface  | Id    | Type | Port | Description         |
| ---------- | ----- | ---- | ---- | ------------------- |
| Server API | `api` | api  | 9740 | phoenixd's HTTP API |

Bound on the `api-multi` MultiHost over HTTP and not masked.

**phoenixd is API-only — there is no interface to open in a browser.** You drive it with HTTP calls or the bundled command-line client.

**Authentication is HTTP basic auth with an empty username** and the generated password, applied by phoenixd itself rather than by StartOS. Anyone who can reach the address with that password can spend, so treat both as wallet credentials.

## Installation and First-Run Flow

Install does nothing beyond creating the volume. There is no task, no seeding, and no configuration.

**The first start creates the wallet**: phoenixd generates a seed, writes the configuration with a fresh API password, and connects to the provider.

Two things then need retrieving by hand, from the service's terminal:

- **The API password**, from the configuration file. Every API call and every command-line invocation needs it.
- **The seed phrase**, from its own file, if you want it written down. It is not displayed anywhere in StartOS.

The bundled command-line client reads the configuration itself, so inside the container the password can usually be omitted.

## Actions

**None.** The package ships an empty action set — phoenixd is configured by its own file and driven by its API.

**In particular there is no action to reveal the password or the seed**, and no action to rotate the password. Both are read from the volume through the terminal.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

One check, on the only daemon.

| Check     | Displayed as     | Method                 |
| --------- | ---------------- | ---------------------- |
| `primary` | "primary daemon" | Port 9740 is listening |

It reports that the API is serving. **It says nothing about the wallet**: whether the node is connected to the provider, whether channels are usable, and whether payments are succeeding are all invisible to it and visible through the API.

## Backups and Restore

The `main` volume is copied wholesale — `sdk.Backups.ofVolumes('main')`. That is the seed, the channel database, the payment history, and the API password.

**This backup is the wallet, in full.** It is the only recovery path for the balance held in channels, and anyone who holds it holds the funds.

**Do not run a restored copy alongside the original.** Two nodes sharing channel state is the classic way to lose Lightning funds — the second one broadcasts stale state and gets penalised for it.

A restored instance comes back with the same node identity, the same channels, and the same API password.

## Limitations and Differences

1. **The wallet depends on ACINQ's service provider** for channels and liquidity. This is not a self-contained Lightning node.
2. **The API password and the seed are only in the volume.** No action surfaces either; you read them from the service's terminal.
3. **There is no way to rotate the API password from StartOS.**
4. **No web interface**, and no StartOS-side configuration at all.
5. **The backup is the wallet** — as sensitive as the seed, and required for the channel balance.
6. **Never run two copies of the same backup.**
7. **Mainnet only.**

---

## Quick Reference for AI Consumers

```yaml
package_id: phoenixd
image: acinq/phoenixd
architectures:
  - x86_64
  - aarch64
subcontainers:
  - phoenixd-sub
volumes:
  main: /phoenix/.phoenix # seed.dat, phoenix.conf (holds the API password), channel db
file_models: [] # phoenixd generates and owns phoenix.conf
startos_managed_env_vars: []
dependencies: [] # channels are managed by ACINQ's LSP, not a local Bitcoin node
interfaces:
  api: { type: api, port: 9740 } # HTTP basic auth, empty username, password from phoenix.conf
actions: [] # no reveal, no rotate — both are read from the volume via the terminal
tasks: []
health_checks:
  - primary # port only; says nothing about LSP connectivity or channel state
```
