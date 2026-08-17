import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.9.0:3',
  releaseNotes: {
    en_US: `The HTTP API reference now has its own link.

The Documentation section listed phoenixd's operator guide and said it covered the HTTP API. It doesn't — upstream keeps the endpoint reference on a separate page, which is now listed beside it. Since phoenixd has no web interface and that API is how you actually use it, it is worth a link of its own.`,
    es_ES: `La referencia de la API HTTP ahora tiene su propio enlace.

La sección de Documentación indicaba la guía del operador de phoenixd y decía que cubría la API HTTP. No es así: upstream mantiene la referencia de endpoints en una página aparte, que ahora aparece junto a ella. Como phoenixd no tiene interfaz web y esa API es la forma real de usarlo, merece un enlace propio.`,
    de_DE: `Die HTTP-API-Referenz hat jetzt einen eigenen Link.

Der Abschnitt Dokumentation nannte die Betriebsanleitung von phoenixd und behauptete, sie decke die HTTP-API ab. Das tut sie nicht — upstream führt die Endpunkt-Referenz auf einer eigenen Seite, die nun daneben aufgeführt ist. Da phoenixd keine Weboberfläche hat und diese API der eigentliche Weg zur Nutzung ist, verdient sie einen eigenen Link.`,
    pl_PL: `Dokumentacja API HTTP ma teraz własny odnośnik.

Sekcja Dokumentacja podawała przewodnik operatora phoenixd i twierdziła, że obejmuje on API HTTP. Tak nie jest — upstream trzyma opis punktów końcowych na osobnej stronie, która teraz znajduje się obok. Ponieważ phoenixd nie ma interfejsu webowego, a to API jest faktycznym sposobem korzystania z niego, zasługuje na własny odnośnik.`,
    fr_FR: `La référence de l'API HTTP a désormais son propre lien.

La section Documentation renvoyait au guide d'exploitation de phoenixd en affirmant qu'il couvrait l'API HTTP. Ce n'est pas le cas : en amont, la référence des points d'accès occupe une page distincte, désormais listée à côté. Comme phoenixd n'a pas d'interface web et que cette API est la façon réelle de s'en servir, elle mérite son propre lien.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
