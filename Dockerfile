FROM acinq/phoenixd:0.6.3

USER root

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD ./scripts/check.sh /usr/local/bin/check.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/check.sh
RUN ln -s /phoenix/phoenix-cli /usr/local/bin/phoenix-cli

RUN cat > /etc/bash.bashrc << 'EOF'
#!/bin/bash
printf "\n [i] Welcome to phoenixd for StartOS!\n\n"
phoenix-cli -h
echo ""
EOF

RUN ln -s /root/.phoenix /phoenix/.phoenix

