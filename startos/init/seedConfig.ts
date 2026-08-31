import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { apiPasswordSpec, phoenixConf } from '../fileModels/phoenix.conf'
import { storeJson } from '../fileModels/store.json'

export const seedConfig = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {})
  await phoenixConf.merge(effects, {
    'http-password': utils.getDefaultString(apiPasswordSpec),
  })
})
