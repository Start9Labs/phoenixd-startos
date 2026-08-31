import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const apiPasswordSpec = { charset: 'a-z,A-Z,0-9', len: 32 }

export const autoLiquidityValues = ['off', '2m', '5m', '10m'] as const
export const feeCreditValues = ['off', '50k', '125k', '250k'] as const

const shape = z
  .object({
    'http-password': z.string().optional().catch(undefined),
    'electrum-server': z.string().optional().catch(undefined),
    'auto-liquidity': z.enum(autoLiquidityValues).optional().catch(undefined),
    'max-mining-fee': z.string().optional().catch(undefined),
    'max-fee-credit': z.enum(feeCreditValues).optional().catch(undefined),
  })
  .catchall(z.string())

type Conf = z.infer<typeof shape>

export const phoenixConf = FileHelper.env<Conf, Conf>(
  { base: sdk.volumes.main, subpath: 'phoenix.conf' },
  shape,
  {
    onRead: (raw) => shape.parse(raw),
    // An unset key, or one `.catch()` repaired, is `undefined`, and the env
    // serializer would write that as the literal string.
    onWrite: (conf) =>
      Object.fromEntries(
        Object.entries(conf).filter(([, value]) => value !== undefined),
      ),
  },
)
