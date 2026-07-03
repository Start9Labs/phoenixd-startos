import { sdk } from './sdk'
import { port } from './utils'
import { i18n } from './i18n'

// Host id (the `sdk.MultiHost.of` group) — distinct from the interface id
// exported on it. Used by dependents for `sdk.host.get` lookups.
export const apiHostId = 'api-multi'

// Interface id (the exported service interface on the host above).
export const apiInterfaceId = 'api'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const apiMulti = sdk.MultiHost.of(effects, apiHostId)
  const apiMultiOrigin = await apiMulti.bindPort(port, {
    protocol: 'http',
  })
  const api = sdk.createInterface(effects, {
    name: i18n('Server API'),
    id: apiInterfaceId,
    description: i18n('Your phoenixd server API'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const apiReceipt = await apiMultiOrigin.export([api])

  return [apiReceipt]
})
