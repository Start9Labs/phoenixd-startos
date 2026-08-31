import { sdk } from '../sdk'
import { i18n } from '../i18n'
import { setApiPassword } from '../actions/setApiPassword'
import { storeJson } from '../fileModels/store.json'

export const watchApiPassword = sdk.setupOnInit(async (effects) => {
  if (await storeJson.read((s) => s.apiPasswordSet).const(effects)) return

  await sdk.action.createOwnTask(effects, setApiPassword, 'important', {
    reason: i18n(
      'phoenixd has no web interface — the API password is how you use it, and no one can read it back to you. Set one you keep.',
    ),
  })
})
