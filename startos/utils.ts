import { T } from '@start9labs/start-sdk'

export const port = 9740
export const mountpoint = '/phoenix/.phoenix'
export const cli = '/phoenix/phoenix-cli'

// update-ca-certificates folds this into /etc/ssl/certs/ca-certificates.crt,
// which is where phoenixd's rustls looks for its trust roots.
export const rootCaPath = '/usr/local/share/ca-certificates/startos-root-ca.crt'

/** `sdk.getRootCa` in start-sdk 2.0.10; inline until this package is on it. */
export const getRootCa = async (effects: T.Effects) =>
  (await effects.getSslCertificate({ hostnames: [] })).at(-1)!
