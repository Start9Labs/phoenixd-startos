import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.0:2',
  releaseNotes: {
    en_US: `Updated phoenixd to 0.9.0.

This release also migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later).

Full release notes: https://github.com/ACINQ/phoenixd/releases/tag/v0.9.0`,
    es_ES: `Actualiza phoenixd a 0.9.0.

Esta versión también migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior).

Notas de la versión completas: https://github.com/ACINQ/phoenixd/releases/tag/v0.9.0`,
    de_DE: `Aktualisiert phoenixd auf 0.9.0.

Diese Version stellt das Paket außerdem auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer).

Vollständige Versionshinweise: https://github.com/ACINQ/phoenixd/releases/tag/v0.9.0`,
    pl_PL: `Aktualizuje phoenixd do 0.9.0.

Ta wersja przenosi też pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego).

Pełne informacje o wydaniu: https://github.com/ACINQ/phoenixd/releases/tag/v0.9.0`,
    fr_FR: `Met à jour phoenixd vers 0.9.0.

Cette version fait également passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure).

Notes de version complètes : https://github.com/ACINQ/phoenixd/releases/tag/v0.9.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
