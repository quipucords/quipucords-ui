FROM registry.access.redhat.com/ubi9/nodejs-22@sha256:b7c468c6cafa40380bf6cd8c89ad2f94ad4c85e47e2fa6e2e4a33d0c5d0c8ef7 as npm_builder
ARG QUIPUCORDS_BRANDED="false"
ARG REACT_APP_FEATURE_REPORTS_VIEW="false"
# Become root before installing anything
USER root
# install dependencies in a separate layer to save dev time
WORKDIR /app
COPY package.json package-lock.json .
RUN SKIP_POSTINSTALL="true" npm ci \
    --no-audit \
    --omit=dev

COPY . .
RUN export UI_BRAND=${QUIPUCORDS_BRANDED}; npm run build

FROM registry.access.redhat.com/ubi9/nginx-124@sha256:b9c2c8657761ea521f49ade5b330e5f81ac03372a093588f142de736e13336af
ARG CPE_NAME="cpe:/a:redhat:discovery:2::el9"
ARG K8S_DESCRIPTION="Quipucords UI"
ARG K8S_DISPLAY_NAME="quipucords-ui"
ARG K8S_NAME="quipucords/quipucords-ui"
ARG OCP_TAGS="quipucords"
ARG REDHAT_COMPONENT="quipucords-ui-container"

# original NGINX user; update if the number ever change
# https://github.com/sclorg/nginx-container/blob/e7d8db9bc5299a4c4e254f8a82e917c7c136468b/1.22/Dockerfile.rhel9#L84
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
