import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'phoenixd',
  title: 'phoenixd',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/phoenixd-startos/',
  upstreamRepo: 'https://github.com/ACINQ/phoenixd/',
  supportSite: 'https://github.com/ACINQ/phoenixd/issues/',
  marketingSite: 'https://phoenix.acinq.co/server/',
  donationUrl: null,
  docsUrl:
    'https://github.com/Start9Labs/phoenixd-startos/blob/master/instructions.md',
  description: {
    short: 'Lightning backend for Phoenix Wallet',
    long: 'phoenixd is a minimal, specialized Lightning node designed for sending and receiving Lightning payments. phoenixd makes it very easy to develop any application that needs to interact with Lightning, by abstracting away all the complexity, without compromising on self-custody',
  },
  volumes: ['main'],
  images: {
    phoenixd: {
      source: { dockerTag: 'acinq/phoenixd:0.7.1' },
    },
  },
  dependencies: {},
})
