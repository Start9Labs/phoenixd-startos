import { sdk } from '../sdk'
import { selectedElectrumServer } from '../chainSource'
import { phoenixConf } from '../fileModels/phoenix.conf'

export const watchChainSource = sdk.setupOnInit(async (effects) => {
  // Absent means absent: with no address to write, phoenixd falls back to its
  // own public pool rather than to an address that reaches nothing.
  await phoenixConf.merge(effects, {
    'electrum-server': (await selectedElectrumServer(effects)) ?? undefined,
  })
})
