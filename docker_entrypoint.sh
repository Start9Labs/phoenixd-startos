#!/bin/sh

printf "\n\n [i] Starting phoenixd ...\n\n"

# chown phoenix:phoenix -R /phoenix

_term() {
  echo "Caught TERM signal!"
  kill -TERM "$phoenixd_process" 2>/dev/null
}

# printf "\n\n [i] Doing the SU ...\n\n"
# passwd -u phoenix
# su - phoenix -c "/phoenix/bin/phoenixd --agree-to-terms-of-service --http-bind-ip 0.0.0.0" &
# phoenixd_process=$!

/phoenix/bin/phoenixd --agree-to-terms-of-service --http-bind-ip 0.0.0.0 &
phoenixd_process=$!

trap _term TERM

wait $phoenixd_process
