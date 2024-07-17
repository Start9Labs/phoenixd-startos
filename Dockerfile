# Use Ubuntu image as build stage for compatibility with macOS arm64 builds
FROM eclipse-temurin:21-jdk-jammy AS build

# Set necessary args and environment variables for building phoenixd
ARG PHOENIXD_BRANCH=v0.3.0
ARG PHOENIXD_COMMIT_HASH=8e21bcf1731e13d7b0c7e3e62cecd54b0facc557

# Upgrade all packages and install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && apt clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Git pull phoenixd source at specified tag/branch and compile phoenixd
WORKDIR /phoenixd
RUN git clone --recursive --single-branch --branch ${PHOENIXD_BRANCH} -c advice.detachedHead=false \
    https://github.com/ACINQ/phoenixd . \
    && test `git rev-parse HEAD` = ${PHOENIXD_COMMIT_HASH} || exit 1 \
    && ./gradlew distTar
RUN mkdir -p /target && tar --strip-components=1 -xvf /phoenixd/build/distributions/phoenix-*-jvm.tar -C /target && rm /target/bin/*.bat

FROM eclipse-temurin:21-jre-alpine AS final

RUN apk update && apk add --no-cache nginx yq && rm -rf /tmp/* /var/cache/apk/* /var/tmp/*

# Copy entrypoint, scripts and prepare convinient symbolic links 
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD ./scripts/check.sh /usr/local/bin/check.sh
RUN chmod a+x /usr/local/bin/*.sh
RUN ln -s /phoenix/bin/phoenix-cli /usr/local/bin/phoenix-cli
RUN echo -e '#!/bin/ash\n# This is a dummy bash wrapper script for ash\nprintf "\n [i] Welcome to phoenixd for StartOS!\n\n"\nphoenix-cli -h\n# Pass all parameters to ash\nash "$@"' > /bin/bash && chmod +x /bin/bash

# Copy the release target from the build stage
WORKDIR /phoenix
COPY --chown=root:root --from=build /target /phoenix
RUN ln -s /root/.phoenix /phoenix/.phoenix

# Indicate that the container listens on port 9740
EXPOSE 9740

# Expose default data directory as VOLUME
VOLUME [ "/phoenix" ]
