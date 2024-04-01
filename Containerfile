FROM registry.access.redhat.com/ubi9/nodejs-18 as yarn_builder
# Become root before installing anything
USER root
RUN dnf update -y && dnf clean all
RUN npm install --global yarn

WORKDIR /app
COPY package.json yarn.lock .
RUN yarn

COPY . .
RUN yarn build

FROM registry.access.redhat.com/ubi9/nginx-122
COPY --from=yarn_builder /app/build /opt/app-root/src
CMD nginx -g "daemon off;"