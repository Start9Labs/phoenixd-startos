import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  source: Value.union({
    name: i18n('Chain Source'),
    description: i18n(
      'Where phoenixd watches the blockchain from. Whoever runs that server sees the addresses this wallet deposits to and withdraws from.',
    ),
    warning: null,
    default: 'public',
    variants: Variants.of({
      public: {
        name: i18n('ACINQ’s public servers'),
        spec: InputSpec.of({}),
      },
      electrs: {
        name: i18n('Electrs on this server'),
        spec: InputSpec.of({}),
      },
      fulcrum: {
        name: i18n('Fulcrum on this server'),
        spec: InputSpec.of({}),
      },
      custom: {
        name: i18n('Another Electrum server'),
        spec: InputSpec.of({
          server: Value.text({
            name: i18n('Electrum Server'),
            description: i18n(
              'As host:port. It must serve TLS with a certificate this server trusts — phoenixd offers no plaintext or self-signed option.',
            ),
            required: true,
            default: null,
            placeholder: 'electrum.example.com:50002',
            patterns: [
              {
                regex: '[a-zA-Z0-9.-]+:[0-9]{1,5}',
                description: i18n(
                  'Must be host:port, e.g. electrum.example.com:50002',
                ),
              },
            ],
          }),
        }),
      },
    }),
  }),
})

export const setChainSource = sdk.Action.withInput(
  'set-chain-source',

  async () => ({
    name: i18n('Set Chain Source'),
    description: i18n(
      'Choose the Electrum server phoenixd follows the blockchain through. Pointing it at an indexer on this server keeps your on-chain activity off a stranger’s.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const selection = await storeJson.read((s) => s.chainSource).once()
    const server = await storeJson.read((s) => s.customElectrumServer).once()

    return {
      source:
        selection === 'custom'
          ? {
              selection: 'custom' as const,
              value: { server: server ?? undefined },
            }
          : { selection: selection ?? 'public', value: {} },
    }
  },

  async ({ effects, input }) =>
    storeJson.merge(effects, {
      chainSource: input.source.selection,
      ...(input.source.selection === 'custom' && {
        customElectrumServer: input.source.value.server,
      }),
    }),
)
