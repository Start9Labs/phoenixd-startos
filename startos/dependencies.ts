import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { indexers } from './chainSource'
import { storeJson } from './fileModels/store.json'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const source = await storeJson.read((s) => s.chainSource).const(effects)
  if (source !== 'electrs' && source !== 'fulcrum') return {}

  const { packageId, versionRange, healthChecks } = indexers[source]

  return {
    [packageId]: {
      kind: 'running',
      versionRange,
      healthChecks,
    },
  } as Record<string, T.DependencyRequirement>
})
