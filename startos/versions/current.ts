import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.0:4',
  releaseNotes: {
    en_US: `Adds three actions — Set API Password, Set Chain Source, and Set Liquidity Policy — covering the API credential, where phoenixd watches the blockchain from, and the caps on what it spends buying inbound liquidity from ACINQ.

Set Chain Source can point phoenixd at Electrs or Fulcrum on this server instead of one of ACINQ's public servers.

A Node health check now reports the block height and how many channels are open.`,
    es_ES: `Añade tres acciones —Establecer la contraseña de la API, Establecer la fuente de la cadena y Establecer la política de liquidez— que cubren la credencial de la API, desde dónde observa phoenixd la cadena de bloques y los límites de lo que gasta comprando liquidez entrante a ACINQ.

Establecer la fuente de la cadena puede apuntar phoenixd a Electrs o Fulcrum en este servidor en lugar de a un servidor público de ACINQ.

Una comprobación de estado Nodo ahora informa de la altura del bloque y de cuántos canales hay abiertos.`,
    de_DE: `Fügt drei Aktionen hinzu — API-Passwort setzen, Chain-Quelle setzen und Liquiditätsrichtlinie setzen — für die API-Zugangsdaten, den Ort, von dem phoenixd die Blockchain beobachtet, und die Obergrenzen für den Kauf eingehender Liquidität bei ACINQ.

Chain-Quelle setzen kann phoenixd auf Electrs oder Fulcrum auf diesem Server richten statt auf einen öffentlichen Server von ACINQ.

Eine Knoten-Zustandsprüfung meldet jetzt die Blockhöhe und die Zahl der offenen Kanäle.`,
    pl_PL: `Dodaje trzy akcje — Ustaw hasło API, Ustaw źródło łańcucha i Ustaw politykę płynności — obejmujące poświadczenie API, miejsce, z którego phoenixd obserwuje łańcuch bloków, oraz limity wydatków na zakup płynności przychodzącej od ACINQ.

Ustaw źródło łańcucha może skierować phoenixd na Electrs lub Fulcrum na tym serwerze zamiast na publiczny serwer ACINQ.

Kontrola stanu Węzeł podaje teraz wysokość bloku i liczbę otwartych kanałów.`,
    fr_FR: `Ajoute trois actions — Définir le mot de passe de l'API, Définir la source de la chaîne et Définir la politique de liquidité — couvrant l'identifiant de l'API, l'endroit d'où phoenixd observe la chaîne de blocs, et les plafonds de dépense pour l'achat de liquidité entrante auprès d'ACINQ.

Définir la source de la chaîne peut pointer phoenixd vers Electrs ou Fulcrum sur ce serveur plutôt que vers un serveur public d'ACINQ.

Un contrôle de santé Nœud indique désormais la hauteur de bloc et le nombre de canaux ouverts.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
