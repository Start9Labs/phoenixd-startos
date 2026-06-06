import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.8.0:0',
  releaseNotes: {
    en_US: `**Bumps**

- phoenixd → 0.8.0

**Internal**

- start-sdk → 1.5.3`,
    es_ES: `**Actualizaciones**

- phoenixd → 0.8.0

**Interno**

- start-sdk → 1.5.3`,
    de_DE: `**Aktualisierungen**

- phoenixd → 0.8.0

**Intern**

- start-sdk → 1.5.3`,
    pl_PL: `**Aktualizacje**

- phoenixd → 0.8.0

**Wewnętrzne**

- start-sdk → 1.5.3`,
    fr_FR: `**Mises à jour**

- phoenixd → 0.8.0

**Interne**

- start-sdk → 1.5.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
