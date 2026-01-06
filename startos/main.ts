import { sdk } from './sdk'
import { port } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting phoenixd!')

  const mountpoint = '/phoenix/.phoenix'

  const subcontainer = await sdk.SubContainer.of(
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

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects)
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
        display: 'primary daemon',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, port, {
            successMessage: 'The server is ready',
            errorMessage: 'The server is not ready',
          }),
      },
      requires: ['chown'],
    })
})
