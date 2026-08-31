import { T } from '@start9labs/start-sdk'
import {
  electrumHostId as electrsHostId,
  port as electrsPort,
} from 'electrs-startos/startos/utils'
import {
  electrumPort as fulcrumPort,
  mainHostId as fulcrumHostId,
} from 'fulcrum-startos/startos/utils'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

export const indexers = {
  electrs: {
    packageId: 'electrs',
    hostId: electrsHostId,
    internalPort: electrsPort,
    versionRange: '>=0.11.1:11',
    healthChecks: ['electrs', 'sync'],
  },
  fulcrum: {
    packageId: 'fulcrum',
    hostId: fulcrumHostId,
    internalPort: fulcrumPort,
    versionRange: '>=2.1.1:8',
    healthChecks: ['primary', 'sync-progress'],
  },
} satisfies Record<string, { packageId: string } & Record<string, unknown>>

export type Indexer = keyof typeof indexers

/**
 * The `electrum-server` value for the selected source, or null for phoenixd's
 * own public pool. An indexer's TLS bridge address, not its plaintext one:
 * phoenixd hardcodes `TLS.TRUSTED_CERTIFICATES()` and has no plaintext option.
 */
export const selectedElectrumServer = async (effects: T.Effects) => {
  const store = await storeJson
    .read((s) => [s.chainSource, s.customElectrumServer] as const)
    .const(effects)
  if (!store) return null

  const [source, custom] = store
  if (source === 'public') return null
  if (source === 'custom') return custom ?? null

  const { packageId, hostId, internalPort } = indexers[source]
  return sdk.host
    .getBridgeAddress(effects, { packageId, hostId, internalPort, ssl: true })
    .const()
}
