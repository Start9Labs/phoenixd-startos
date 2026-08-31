import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'phoenixd',
  title: 'phoenixd',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/phoenixd-startos',
  upstreamRepo: 'https://github.com/ACINQ/phoenixd/',
  marketingUrl: 'https://phoenix.acinq.co/server/',
  donationUrl: null,
  description: i18n.description,
  volumes: ['main', 'startos'],
  images: {
    phoenixd: {
      source: { dockerTag: 'acinq/phoenixd:0.9.0' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
