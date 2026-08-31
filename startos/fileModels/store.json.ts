import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const chainSources = ['public', 'electrs', 'fulcrum', 'custom'] as const

const shape = z.looseObject({
  apiPasswordSet: z.boolean().catch(false),
  chainSource: z.enum(chainSources).catch('public'),
  customElectrumServer: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)
