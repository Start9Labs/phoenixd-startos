import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { apiPasswordSpec, phoenixConf } from '../fileModels/phoenix.conf'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  'http-password': Value.text({
    name: i18n('API Password'),
    description: i18n(
      'Sent as the HTTP basic auth password, with an empty username.',
    ),
    required: true,
    masked: true,
    default: apiPasswordSpec,
    generate: apiPasswordSpec,
    patterns: [
      {
        regex: '[^=\\s]+',
        description: i18n('May not contain spaces or an equals sign.'),
      },
    ],
  }),
})

export const setApiPassword = sdk.Action.withInput(
  'set-api-password',

  async () => ({
    name: i18n('Set API Password'),
    description: i18n(
      'Set the password every API call and phoenix-cli invocation needs. It is shown once, when you set it.',
    ),
    warning: i18n(
      'Anything already using the old password — Alby Hub, your own scripts — must be given the new one.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // No prefill: a form seeded with the current password would be a way to read
  // it back, and `default` mints a fresh one each time the form opens.
  async () => ({}),

  async ({ effects, input }) => {
    await phoenixConf.merge(effects, input)
    await storeJson.merge(effects, { apiPasswordSet: true })

    return {
      version: '1',
      title: i18n('API Password'),
      message: i18n(
        'Save this now — it is not shown again, and anyone who has it can spend from this wallet. phoenixd restarts to apply it.',
      ),
      result: {
        type: 'single',
        name: i18n('API Password'),
        description: null,
        value: input['http-password'],
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
