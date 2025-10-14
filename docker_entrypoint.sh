#!/bin/sh

printf "\n\n [i] Starting phoenixd ...\n\n"

_term() {
  echo "Caught TERM signal!"
  kill -TERM "$phoenixd_process" 2>/dev/null
}

/phoenix/phoenixd --agree-to-terms-of-service --http-bind-ip 0.0.0.0 & 
phoenixd_process=$!

trap _term TERM

wait $phoenixd_process
