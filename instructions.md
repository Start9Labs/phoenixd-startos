# phoenixd

phoenixd is API-only — there is no web UI. You drive it from the **Server API** interface or with the bundled `phoenix-cli`, authenticating with an API password you set from StartOS.

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting wallets to a Lightning node on StartOS.
- [phoenixd server docs](https://phoenix.acinq.co/server/*) — the upstream operator guide and the HTTP API reference: configuration, `phoenix-cli` usage, every endpoint, and how channels and fees work.

## What you get on StartOS

- A **Server API** interface on port 9740 — phoenixd's HTTP API, used for sending and receiving Lightning payments, managing channels with ACINQ's LSP, and registering webhooks.
- Wallet data — seed, channel state, and database — persisted in the `main` volume. Back it up.

## Getting set up

1. Start the service.
2. Run **Set API Password**. StartOS raises this as a task, because it is the only way anyone learns a password for the API — nothing can read one back to you afterwards. Save it to your password manager.
3. The seed phrase is written to `seed.dat` inside the data volume and is **not** shown in the StartOS UI. If you want it on paper, retrieve it through the service's terminal: `cat /phoenix/.phoenix/seed.dat`. Lose this seed and you lose access to any on-chain balance not covered by channel state.

## Actions

### Set API Password

Sets the password that every API call and `phoenix-cli` invocation needs, and shows it once. Run it again at any time to rotate. Anything already using the old password — Alby Hub, your own scripts — has to be given the new one.

### Set Chain Source

Chooses where phoenixd watches the blockchain from. Whoever runs that server sees the on-chain addresses this wallet deposits to and withdraws from, so this is a real privacy choice.

- **ACINQ's public servers** — the default. ACINQ picks one for you.
- **Electrs on this server** / **Fulcrum on this server** — your own indexer. Install and sync it first; phoenixd will then require it to be running.
- **Another Electrum server** — a `host:port` you type in. It has to serve TLS with a certificate this server trusts; phoenixd has no plaintext or self-signed option.

### Set Liquidity Policy

Caps what phoenixd spends buying inbound liquidity from ACINQ.

- **Automatic Liquidity** — how much room phoenixd buys when a payment does not fit your current channel. Turning it off makes phoenixd reject those payments instead.
- **Max Mining Fee** — the most it will spend on mining fees for one on-chain operation.
- **Max Fee Credit** — how much ACINQ may hold on your behalf for payments too small to pay for a channel. That credit is **non-refundable**, and payments are rejected once the ceiling is reached.

Left alone, these are phoenixd's own defaults, which do spend without asking.

## Using phoenixd

### Server API

Open the **Server API** interface to copy the address phoenixd listens on. All endpoints require HTTP basic auth with **an empty username** and your API password. For example, to fetch node info from another machine on your LAN:

```
curl -u :<password> http://<server-api-address>/getinfo
```

See the upstream docs for the full endpoint list (`/createinvoice`, `/payinvoice`, `/listchannels`, webhook registration, etc.).

### phoenix-cli

The image ships with `phoenix-cli`, which speaks to the same HTTP API. Open the service's terminal from the **Dashboard** and run, for example:

```
phoenix-cli getinfo
phoenix-cli createinvoice --amountSat=1000 --description="test"
```

Inside the container `phoenix-cli` reads the password from the configuration itself, so you do not need to pass it.

## Health checks

- **primary daemon** — the API is listening.
- **Node** — phoenixd has reached its Electrum server, with the current block height and how many channels are open. A brand-new wallet has none until a Lightning payment arrives and ACINQ opens one.
