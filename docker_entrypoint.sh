#!/bin/sh

printf "\n\n [i] Starting phoenixd ...\n\n"

_term() {
  echo "Caught TERM signal!"
  kill -TERM "$phoenixd_process" 2>/dev/null
}

CONFIG_FILE="/root/.phoenix/start9/config.yaml"
SEED=$(cat /root/.phoenix/seed.dat)

# Parse configuration values using yq
AUTO_LIQUIDITY=$(yq '.auto-liquidity' $CONFIG_FILE)
MAX_MINING_FEE=$(yq '.max-mining-fee' $CONFIG_FILE)
MAX_FEE_CREDIT=$(yq '.max-fee-credit' $CONFIG_FILE)
CHAIN=$(yq '.chain' $CONFIG_FILE)
HTTP_PASSWORD=$(yq '.http-api-pass' $CONFIG_FILE)
VERBOSITY=$(yq '.verbosity' $CONFIG_FILE)
TOR_ADDRESS=$(yq '.tor-address' $CONFIG_FILE)

# Prepare phoenixd command with configuration options
PHOENIXD_CMD="/phoenix/bin/phoenixd --agree-to-terms-of-service --http-bind-ip 0.0.0.0"

# Add options based on config values
[ -n "$AUTO_LIQUIDITY" ] && PHOENIXD_CMD="$PHOENIXD_CMD --auto-liquidity=$AUTO_LIQUIDITY"
[ -n "$MAX_MINING_FEE" ] && PHOENIXD_CMD="$PHOENIXD_CMD --max-mining-fee=$MAX_MINING_FEE"
[ -n "$MAX_FEE_CREDIT" ] && PHOENIXD_CMD="$PHOENIXD_CMD --max-fee-credit=$MAX_FEE_CREDIT"
[ -n "$CHAIN" ] && PHOENIXD_CMD="$PHOENIXD_CMD --chain=$CHAIN"
[ -n "$HTTP_PASSWORD" ] && [ "$HTTP_PASSWORD" != "null" ] && PHOENIXD_CMD="$PHOENIXD_CMD --http-password=$HTTP_PASSWORD"
[ "$VERBOSITY" = "verbose" ] && PHOENIXD_CMD="$PHOENIXD_CMD --verbose" || PHOENIXD_CMD="$PHOENIXD_CMD"

cat << BTC > /root/.phoenix/start9/stats.yaml
---
version: 2
data:
  HTTP API Password:
    type: string
    value: $HTTP_PASSWORD
    description: This is the password for the phoenixd http api.
    copyable: true
    qr: false
    masked: true
  Hostname:
    type: string
    value: $TOR_ADDRESS:9740
    description: The hostname and port that the phoenixd is listening on.
    copyable: true
    qr: false
    masked: false
  12 Words Seed Phrase:
    type: string
    value: $SEED
    description: WARNING: This is your 12 word mnemonic seed phrase. Keep it secret, keep it safe!
    copyable: true
    qr: false
    masked: true
BTC

# Start phoenixd with all prepared options
eval $PHOENIXD_CMD &
phoenixd_process=$!

trap _term TERM

wait $phoenixd_process
