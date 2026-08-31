import { sdk } from '../sdk'
import { setApiPassword } from './setApiPassword'
import { setChainSource } from './setChainSource'
import { setLiquidityPolicy } from './setLiquidityPolicy'

export const actions = sdk.Actions.of()
  .addAction(setApiPassword)
  .addAction(setChainSource)
  .addAction(setLiquidityPolicy)
