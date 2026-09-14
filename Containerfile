FROM registry.access.redhat.com/ubi10/nodejs-24@sha256:e6980356c53b5912204bab5263976bab5c5b3049b2a40e73881788116f15e66e as npm_builder
ARG QUIPUCORDS_BRANDED="false"
ARG REACT_APP_FEATURE_REPORTS_VIEW="true"
ARG REACT_APP_FEATURE_VAULT_AUTH="true"
# Become root before installing anything
USER root
# install dependencies in a separate layer to save dev time
WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci \
    --no-audit \
    --omit=dev

COPY . .
RUN export UI_BRAND=${QUIPUCORDS_BRANDED}; npm run build

FROM registry.access.redhat.com/ubi10/nginx-126@sha256:259eec971ee484cb83a70ab2e740dd2405e73025de5df7c13f216f8fe80ea3ed
ARG CPE_NAME="cpe:/a:redhat:discovery:2::el10"
ARG K8S_DESCRIPTION="Quipucords UI"
ARG K8S_DISPLAY_NAME="quipucords-ui"
ARG K8S_NAME="quipucords/quipucords-ui"
ARG OCP_TAGS="quipucords"
ARG REDHAT_COMPONENT="quipucords-ui-container"

# original NGINX user; update if the number ever change
# https://github.com/sclorg/nginx-container/blob/2cfa51b1f452bb212b8f3d797e18303641022dec/1.26/Dockerfile.rhel10#L85
ENV NGINX_USER=1001
# temporarily switch to root user
USER root
# konflux requires licenses in this folder
RUN mkdir /licenses
COPY --from=npm_builder /app/LICENSE /licenses/LICENSE
COPY --from=npm_builder /app/build /opt/app-root/src
COPY deploy/nginx.conf /etc/nginx/nginx.conf.template
COPY deploy/entrypoint.sh /opt/app-root/.
# set ownership to nginx user and change back to it
RUN chown ${NGINX_USER} -R /licenses /opt/app-root/
USER ${NGINX_USER}

CMD ["/bin/bash", "/opt/app-root/entrypoint.sh"]

LABEL com.redhat.component=${REDHAT_COMPONENT} \
    cpe=${CPE_NAME} \
    description=${K8S_DESCRIPTION} \
    io.k8s.description=${K8S_DESCRIPTION} \
    io.k8s.display-name=${K8S_DISPLAY_NAME} \
    io.openshift.tags=${OCP_TAGS} \
    name=${K8S_NAME} \
    summary=${K8S_DESCRIPTION}
