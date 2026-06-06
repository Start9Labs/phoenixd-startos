<p align="center">
  <img src="icon.svg" alt="phoenixd Logo" width="21%">
</p>

# phoenixd on StartOS

> **Upstream docs:** <https://phoenix.acinq.co/server>
>
> Everything not listed in this document should behave the same as upstream
> phoenixd. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[phoenixd](https://github.com/ACINQ/phoenixd) is a minimal Lightning wallet server that connects to ACINQ's Lightning Service Provider (LSP) for channel management and liquidity.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | `acinq/phoenixd` (upstream unmodified) |
| Architectures | x86_64, aarch64 |
| Entrypoint | Default upstream entrypoint |

**Startup order:** A `chown` one-shot sets ownership of the data directory to `phoenix:phoenix`, then the daemon starts.

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/phoenix/.phoenix` | Wallet data, seed, channels, database |

**Important:** The `main` volume contains your Lightning wallet seed and funds. Ensure backups are secure.

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Installation | Download binary or Docker image | Install from marketplace or sideload `.s9pk` |
| First start | Run `phoenixd` manually | Automatic via StartOS |
| API password | Generated in `phoenix.conf` | Same — generated on first run, found in `phoenix.conf` |

No setup wizard or admin account creation is needed. The server is ready to use after first start.

---

## Configuration Management

phoenixd runs with default settings connecting to ACINQ's LSP. No user-configurable settings are exposed through StartOS actions.

Configuration is done via the HTTP API or by editing config files directly in the data directory.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Type | Description |
|-----------|------|----------|------|-------------|
| Server API | 9740 | HTTP | api | HTTP API for wallet operations |

The API requires authentication using the HTTP password generated on first run (found in `phoenix.conf`).

---

## Actions (StartOS UI)

None. All interaction is through the HTTP API.

---

## Backups and Restore

**Included in backup:**

- `main` volume — wallet seed, channel state, transaction history

**Restore behavior:**

- All data is restored, including wallet seed and channel state
- No reconfiguration needed

**Critical:** Your Lightning funds depend on this backup. The seed phrase allows recovery, but channel state is also important for fund safety.

---

## Health Checks

| Check | Display | Method | Messages |
|-------|---------|--------|----------|
| Primary daemon | "primary daemon" | Port listening (9740) | "The server is ready" / "The server is not ready" |

---

## Dependencies

None. phoenixd connects directly to ACINQ's Lightning Service Provider (LSP) for channel management, liquidity provisioning, and routing. No local Bitcoin node is required.

---

## Limitations and Differences

1. **ACINQ dependency** — Requires connection to ACINQ's LSP; cannot use arbitrary Lightning peers.
2. **No local Bitcoin node** — Relies on ACINQ infrastructure for blockchain data.
3. **No web UI** — API-only interface; requires external tools or custom integration.
4. **Liquidity fees** — ACINQ charges fees for channel liquidity and on-chain operations.

---

## What Is Unchanged from Upstream

- Full phoenixd API functionality
- Self-custody of funds (you control the seed)
- Send and receive Lightning payments
- BOLT11 and BOLT12 invoice support
- Webhook notifications
- Multi-account support

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: phoenixd
image: acinq/phoenixd
architectures:
  - x86_64
  - aarch64
volumes:
  main: /phoenix/.phoenix
ports:
  api: 9740
dependencies: none
startos_managed_env_vars: none
actions: none
```
