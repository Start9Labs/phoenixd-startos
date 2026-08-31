import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { phoenixConf } from '../fileModels/phoenix.conf'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  'auto-liquidity': Value.select({
    name: i18n('Automatic Liquidity'),
    description: i18n(
      'How much inbound liquidity phoenixd buys from ACINQ when a payment does not fit the current channel. Off rejects those payments instead of paying for room.',
    ),
    default: '2m',
    values: {
      off: i18n('Off'),
      '2m': i18n('2,000,000 sats'),
      '5m': i18n('5,000,000 sats'),
      '10m': i18n('10,000,000 sats'),
    },
  }),
  'max-mining-fee': Value.number({
    name: i18n('Max Mining Fee'),
    description: i18n(
      'The most phoenixd will spend on mining fees for one on-chain operation. Leave blank for 1% of the automatic liquidity amount.',
    ),
    required: false,
    default: null,
    min: 5_000,
    max: 200_000,
    step: 1_000,
    integer: true,
    units: 'sats',
  }),
  'max-fee-credit': Value.select({
    name: i18n('Max Fee Credit'),
    description: i18n(
      'How much ACINQ may hold as fee credit for payments too small to pay for a channel. Fee credit is non-refundable, and payments are rejected once the ceiling is reached.',
    ),
    default: '50k',
    values: {
      off: i18n('Off'),
      '50k': i18n('50,000 sats'),
      '125k': i18n('125,000 sats'),
      '250k': i18n('250,000 sats'),
    },
  }),
})

export const setLiquidityPolicy = sdk.Action.withInput(
  'set-liquidity-policy',

  async () => ({
    name: i18n('Set Liquidity Policy'),
    description: i18n(
      'Cap what phoenixd is allowed to spend buying inbound liquidity from ACINQ, and how much fee credit it may accrue.',
    ),
    warning: i18n(
      'Turning automatic liquidity off makes phoenixd reject any payment that does not fit the channels it already has.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const miningFee = await phoenixConf.read((c) => c['max-mining-fee']).once()
    return {
      'auto-liquidity':
        (await phoenixConf.read((c) => c['auto-liquidity']).once()) ??
        undefined,
      'max-mining-fee': miningFee ? Number(miningFee) : null,
      'max-fee-credit':
        (await phoenixConf.read((c) => c['max-fee-credit']).once()) ??
        undefined,
    }
  },

  async ({ effects, input }) =>
    phoenixConf.merge(effects, {
      'auto-liquidity': input['auto-liquidity'],
      'max-fee-credit': input['max-fee-credit'],
      'max-mining-fee': input['max-mining-fee']?.toString(),
    }),
)
