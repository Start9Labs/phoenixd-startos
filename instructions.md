# phoenixd

phoenixd is API-only — there is no web UI. You drive it from the **Server API** interface or with the bundled `phoenix-cli`, authenticating with the HTTP password phoenixd generates on first run.

## Documentation

- [Start9 Bitcoin Guides](https://docs.start9.com/bitcoin-guides/) — connecting wallets to a Lightning node on StartOS.
- [phoenixd server docs](https://phoenix.acinq.co/server) — the upstream operator guide: configuration, `phoenix-cli` usage, and how channels and fees work.
- [phoenixd HTTP API reference](https://phoenix.acinq.co/server/api) — every endpoint, its parameters, and the webhook payloads.

## What you get on StartOS

- A **Server API** interface on port 9740 — phoenixd's HTTP API, used for sending and receiving Lightning payments, managing channels with ACINQ's LSP, and registering webhooks.
- Wallet data — seed, channel state, and database — persisted in the `main` volume. Back it up.

## Getting set up

1. Start the service. On first launch phoenixd creates a fresh wallet seed and writes `phoenix.conf` (including the `http-password`) into the data volume.
2. Retrieve the HTTP password from `phoenix.conf` — open the service's terminal from the **Dashboard** and run `cat /phoenix/.phoenix/phoenix.conf`. Save the `http-password` value to your password manager; every API call and every `phoenix-cli` invocation needs it.
3. The seed phrase is written to `seed.dat` inside the data volume and is **not** shown in the StartOS UI. If you want it on paper, retrieve it through the service's terminal: `cat /phoenix/.phoenix/seed.dat`. Lose this seed and you lose access to any on-chain balance not covered by channel state.

## Using phoenixd

### Server API

Open the **Server API** interface to copy the address phoenixd listens on. All endpoints require HTTP basic auth with **an empty username** and the password from `phoenix.conf`. For example, to fetch node info from another machine on your LAN:

```
curl -u :<password> http://<server-api-address>/getinfo
```

See the upstream docs for the full endpoint list (`/createinvoice`, `/payinvoice`, `/listchannels`, webhook registration, etc.).

### phoenix-cli

The image ships with `phoenix-cli`, which speaks to the same HTTP API. Open the service's terminal from the **Dashboard** and run, for example:

```
phoenix-cli --http-password=<password> getinfo
phoenix-cli --http-password=<password> createinvoice --amountSat=1000 --description="test"
```

`phoenix-cli` reads `phoenix.conf` by default, so inside the container you can usually omit `--http-password` entirely.
