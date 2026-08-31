import { sdk } from './sdk'
import { cli, getRootCa, mountpoint, port, rootCaPath } from './utils'
import { i18n } from './i18n'
import { phoenixConf } from './fileModels/phoenix.conf'

type NodeInfo = { blockHeight: number | null; channels: unknown[] }

const parseInfo = (stdout: string): NodeInfo | null => {
  try {
    return JSON.parse(stdout)
  } catch {
    return null
  }
}

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting phoenixd!'))

  const subcontainer = sdk.SubContainer.of(
    effects,
    { imageId: 'phoenixd' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint,
      readonly: false,
    }),
    'phoenixd-sub',
  )

  // phoenixd reads phoenix.conf once, at startup; these restart it on an edit.
  await phoenixConf
    .read((c) => [
      c['http-password'],
      c['electrum-server'],
      c['auto-liquidity'],
      c['max-mining-fee'],
      c['max-fee-credit'],
    ])
    .const(effects)

  await subcontainer.writeFile(rootCaPath, await getRootCa(effects))

  return sdk.Daemons.of(effects)
    .addOneshot('trust-startos-ca', {
      subcontainer,
      exec: {
        command: ['update-ca-certificates'],
        user: 'root',
      },
      requires: [],
    })
    .addOneshot('chown', {
      subcontainer,
      exec: {
        command: ['chown', '-R', 'phoenix:phoenix', mountpoint],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer,
      exec: {
        command: sdk.useEntrypoint(),
      },
      ready: {
        display: i18n('primary daemon'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, port, {
            successMessage: i18n('The server is ready'),
            errorMessage: i18n('The server is not ready'),
          }),
      },
      requires: ['chown', 'trust-startos-ca'],
    })
    .addHealthCheck('node', {
      ready: {
        display: i18n('Node'),
        trigger: sdk.trigger.cooldownTrigger(30_000),
        fn: async () => {
          const res = await subcontainer.exec([cli, 'getinfo'])
          const info =
            res.exitCode === 0 ? parseInfo(res.stdout.toString()) : null

          if (!info)
            return {
              result: 'failure',
              message: i18n('The API is not answering'),
            }

          const { blockHeight, channels } = info

          if (blockHeight === null)
            return {
              result: 'loading',
              message: i18n('Reaching the Electrum server'),
            }

          // Params are stringified: setupI18n in 2.0.9 runs a number through
          // Intl, which throws on the container's C.UTF-8 locale.
          return channels.length
            ? {
                result: 'success',
                message: i18n('${count} channel(s) open at block ${height}', {
                  count: `${channels.length}`,
                  height: `${blockHeight}`,
                }),
              }
            : {
                result: 'success',
                message: i18n(
                  'At block ${height}, no channels yet — receive a Lightning payment and ACINQ opens one',
                  { height: `${blockHeight}` },
                ),
              }
        },
      },
      requires: ['primary'],
    })
})
