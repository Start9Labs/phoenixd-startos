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

Two oneshots run first: one gives the data directory to the unprivileged user the image runs as, the other installs this server's root CA into the container's trust store.

## Volume and Data Layout

Two volumes, one of which is a wallet.

| Volume    | Mount Point         | Purpose                               |
| --------- | ------------------- | ------------------------------------- |
| `main`    | `/phoenix/.phoenix` | The seed, the channels, the config    |
| `startos` | _unmounted_         | `store.json`; no subcontainer sees it |

| Path           | Written by           | Holds                                         |
| -------------- | -------------------- | --------------------------------------------- |
| `seed.dat`     | phoenixd             | The wallet seed                               |
| `phoenix.conf` | phoenixd and StartOS | The configuration, including the API password |
| _database_     | phoenixd             | Channel state and payment history             |

**The `main` volume is the wallet.** The seed is generated on first start and written here, and channel state is here too — so losing it without a backup loses funds, and copying it copies the wallet.

**Channel state is not recoverable from the seed alone.** A seed restores what is on-chain; the balance in open channels depends on the database, which is why the whole volume matters rather than just the twelve words.

## File Models

Two, one of them phoenixd's own configuration.

| Model                 | Path                  | Holds                                                     |
| --------------------- | --------------------- | --------------------------------------------------------- |
| `phoenixConf` (`env`) | `main:/phoenix.conf`  | The API password, the Electrum server, the liquidity caps |
| `storeJson` (`json`)  | `startos:/store.json` | `apiPasswordSet`, `chainSource`, `customElectrumServer`   |

`phoenix.conf` is a flat `key=value` file, so it is modelled with `FileHelper.env`, and every key phoenixd recognises but the schema does not name is preserved — the limited-access password and the webhook secret phoenixd generates for itself among them.

**A key whose value resolves to `undefined` is stripped before serializing** — that is how an action clears one, and how a value `.catch()` could not repair goes back to phoenixd's own default.

**The seed is not modelled and never will be.** `seed.dat` belongs to phoenixd alone.

## Dependencies

One, and only when the user asks for it.

| Dependency | Kind      | When                             | Health checks              |
| ---------- | --------- | -------------------------------- | -------------------------- |
| `electrs`  | `running` | `store.json` `chainSource` is it | `electrs`, `sync`          |
| `fulcrum`  | `running` | `store.json` `chainSource` is it | `primary`, `sync-progress` |

`setupDependencies` reads the selection and declares only the one chosen, so the default install declares nothing.

**There is still no Bitcoin node in the picture for phoenixd itself.** Channels are opened and managed by ACINQ's Lightning service provider, a third party trusted for liquidity and channel management, and no indexer changes that. An indexer only replaces the public Electrum server phoenixd would otherwise watch the chain through.

It needs internet to reach that provider and the Lightning network.

### Reaching an indexer over the bridge

Two facts make an on-server indexer usable, and both are worth knowing before changing this code:

- **StartOS mints the bridge listener's certificate per connection over a hostname set that includes the accepted socket's own local address**, so the certificate presented on `10.0.3.1:<port>` carries `IP Address:10.0.3.1` in its SANs and the full chain to this server's root. Hostname verification is not the obstacle it looks like.
- **phoenixd's TLS on Linux is rustls reading a PEM bundle** — the first of `/etc/ssl/certs/ca-certificates.crt`, `/etc/pki/tls/certs/ca-bundle.crt`, `/etc/ssl/cert.pem` that exists. Installing this server's root CA into the image's trust store is therefore enough, which is what the `trust-startos-ca` oneshot does.

## Network Access and Interfaces

One interface, and no web page behind it.

| Interface  | Id    | Type | Port | Description         |
| ---------- | ----- | ---- | ---- | ------------------- |
| Server API | `api` | api  | 9740 | phoenixd's HTTP API |

Bound on the `api-multi` MultiHost over HTTP and not masked.

**phoenixd is API-only — there is no interface to open in a browser.** You drive it with HTTP calls or the bundled command-line client.

**Authentication is HTTP basic auth with an empty username** and the password from `phoenix.conf`, checked by phoenixd itself rather than by StartOS. Anyone who can reach the address with that password can spend, so treat both as wallet credentials.

## Installation and First-Run Flow

Install writes `phoenix.conf` with a generated `http-password`, seeds `store.json` with the public chain source, and raises the Set API Password task. Seeding the password rather than leaving it to phoenixd is what keeps the daemon from appending to the file behind the reactive read in `main.ts`, which would restart it mid-boot.

**The first start creates the wallet**: phoenixd generates a seed, connects to the provider, and appends the two secrets the package does not model — the limited-access password and the webhook secret.

The user's own API password comes from running the task's action, which is the only way anyone learns one.

**The seed phrase is read from `seed.dat` through the service's terminal** if the user wants it written down. It is not displayed anywhere in StartOS.

The bundled command-line client reads `phoenix.conf` itself, so inside the container the password can be omitted.

## Actions

Three. phoenixd reads `phoenix.conf` once, at startup, so `main.ts` holds a reactive read of every key that ends up there — editing one restarts the daemon rather than leaving the change to take effect at some later boot.

| Action               | Id                     | Writes                                               |
| -------------------- | ---------------------- | ---------------------------------------------------- |
| Set API Password     | `set-api-password`     | `phoenix.conf` `http-password`                       |
| Set Chain Source     | `set-chain-source`     | `store.json` `chainSource`, `customElectrumServer`   |
| Set Liquidity Policy | `set-liquidity-policy` | `auto-liquidity`, `max-mining-fee`, `max-fee-credit` |

**Set API Password covers both first-set and rotation, and shows the password once** — when it is set. There is deliberately no action that reads the password back: nothing can, and the answer to a lost one is to set a new one.

**Set Chain Source is a union over four sources** — ACINQ's public pool, Electrs on this server, Fulcrum on this server, or a `host:port` typed in. The selection is StartOS state and lives in `store.json`; `electrum-server` in `phoenix.conf` is derived from it by `init/watchChainSource.ts`, which resolves the chosen indexer's **TLS** bridge address and writes nothing at all when the source is the public pool.

**It resolves the TLS bridge address, never the plaintext one.** phoenixd hardcodes `TLS.TRUSTED_CERTIFICATES()` in its `--electrum-server` parser and exposes no plaintext or self-signed option, so the plaintext bridge port is unusable. What makes the TLS one work is the pair of facts below.

**Set Liquidity Policy is the only place the fee ceilings are visible.** Left alone they are phoenixd's own defaults, which do spend without asking.

**No action reveals the seed.** It is read from `seed.dat` through the service's terminal.

## Tasks

One, raised on init while `store.json` says the user has not set an API password.

| Task             | Severity    | Points at          |
| ---------------- | ----------- | ------------------ |
| Set API Password | `important` | `set-api-password` |

**`important`, not `critical`** — the service starts and serves without it, and a dependent that reads the password out of the volume works either way.

## Health Checks

Two.

| Check     | Displayed as     | Method                                   |
| --------- | ---------------- | ---------------------------------------- |
| `primary` | "primary daemon" | Port 9740 is listening                   |
| `node`    | "Node"           | `phoenix-cli getinfo`, polled every 30 s |

`primary` reports that the API is serving. `node` reports the wallet: `loading` until `blockHeight` is non-null, which is what says phoenixd has reached an Electrum server, then `success` with the block height and the number of open channels.

**Zero channels is a success, not a failure.** A fresh wallet has none until a Lightning payment arrives and ACINQ opens one.

## Backups and Restore

Both volumes are copied wholesale — `sdk.Backups.ofVolumes('main', 'startos')`. That is the seed, the channel database, the payment history, and the API password.

**This backup is the wallet, in full.** It is the only recovery path for the balance held in channels, and anyone who holds it holds the funds.

**Do not run a restored copy alongside the original.** Two nodes sharing channel state is the classic way to lose Lightning funds — the second one broadcasts stale state and gets penalised for it.

A restored instance comes back with the same node identity, the same channels, and the same API password.

## Limitations and Differences

1. **The wallet depends on ACINQ's service provider** for channels and liquidity. This is not a self-contained Lightning node, the provider is compiled into phoenixd rather than configured, and no setting here changes it.
2. **A Lightning payment too small to pay for a channel becomes fee credit ACINQ holds**, which is non-refundable. Set Liquidity Policy caps how much accrues; it cannot switch the behavior off.
3. **The seed is only in the volume.** No action surfaces it; you read it from the service's terminal.
4. **An Electrum server must serve TLS with a certificate this container trusts.** phoenixd offers no plaintext or self-signed option. An indexer on this server qualifies because the package installs this server's root CA; an address typed into Set Chain Source has to be publicly trusted, or chain to that same root.
5. **No web interface.**
6. **The backup is the wallet** — as sensitive as the seed, and required for the channel balance.
7. **Never run two copies of the same backup.**
8. **Mainnet only.**

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
oneshots:
  - trust-startos-ca # installs this server's root CA so a bridge address validates
  - chown
volumes:
  main: /phoenix/.phoenix # seed.dat, phoenix.conf (holds the API password), channel db
  startos: null # store.json; mounted nowhere
file_models:
  - phoenix.conf # env; API password, electrum-server, liquidity caps
  - store.json # apiPasswordSet, chainSource, customElectrumServer
startos_managed_env_vars: []
dependencies: # conditional on store.json chainSource; none by default
  - electrs # when chainSource is 'electrs'
  - fulcrum # when chainSource is 'fulcrum'
interfaces:
  api: { type: api, port: 9740 } # HTTP basic auth, empty username, password from phoenix.conf
actions:
  - set-api-password # set + rotate; shows the password once, never reads it back
  - set-chain-source # union: public | electrs | fulcrum | custom host:port
  - set-liquidity-policy # auto-liquidity, max-mining-fee, max-fee-credit
tasks:
  - set-api-password # important; while store.json says no password has been set
health_checks:
  - primary # port 9740 is listening
  - node # phoenix-cli getinfo: block height + open channel count
```
