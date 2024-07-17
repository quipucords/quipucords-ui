FROM registry.access.redhat.com/ubi9/nodejs-18 as npm_builder
# Become root before installing anything
USER root
RUN dnf update -y && dnf clean all

# install dependencies in a separate layer to save dev time
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM registry.access.redhat.com/ubi9/nginx-122
COPY --from=npm_builder /app/build /opt/app-root/src
COPY deploy/nginx.conf /etc/nginx/nginx.conf.template
COPY deploy/entrypoint.sh /opt/app-root/.
CMD ["/bin/bash", "/opt/app-root/entrypoint.sh"]
