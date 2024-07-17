#!/bin/sh

printf "\n\n [i] Starting phoenixd ...\n\n"

# chown phoenix:phoenix -R /phoenix

_term() {
  echo "Caught TERM signal!"
  kill -TERM "$phoenixd_process" 2>/dev/null
}

PASSWD=$(grep 'http-password' /root/.phoenix/phoenix.conf | cut -d '=' -f 2)
SEED=$(cat /root/.phoenix/seed.dat)

cat << BTC > /root/.phoenix/start9/stats.yaml
---
version: 2
data:
  HTTP API Password:
    type: string
    value: $PASSWD
    description: This is the password for the phoenixd http api.
    copyable: true
    qr: false
    masked: true
  Hostname:
    type: string
    value: akjsdnkajsdnkasjndkajsndkjansdkjajsndkajsnd.onion:9740
    description: The hostname and port that the phoenixd is listening on.
    copyable: true
    qr: false
    masked: false
  12 Words Seed Phrase:
    type: string
    value: $SEED
    description: This is your 12 word mnemonic seed phrase. Keep it secret, keep it safe!
    copyable: false
    qr: false
    masked: true
BTC

/phoenix/bin/phoenixd --agree-to-terms-of-service --http-bind-ip 0.0.0.0 &
phoenixd_process=$!

trap _term TERM

wait $phoenixd_process
