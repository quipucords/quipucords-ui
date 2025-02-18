
QUIPUCORDS_UI_CONTAINER_TAG ?= quipucords-ui

help:
	@echo "Please use 'make <target>' where <target> is one of:"
	@echo "  help                          to show this message"
	@echo "  build-container               to build the container image for the quipucords UI"
	@echo "  bump-version <version>        to bump quipucords UI version"

all: help

build-container:
	podman build \
		-t $(QUIPUCORDS_UI_CONTAINER_TAG) --ulimit nofile=4096:4096 .

bump-version:
ifeq ($(version),)
$(error Variable "version" is not set)
endif
	$(eval MINOR=$(shell echo $(version) | sed 's/\([0-9]*\.[0-9]*\).*$$/\1/'))
	@echo "Bumping version to $(version)"
	sed -i 's/^\(LABEL version=\).*$$/\1$(version)/' Containerfile
	sed -i 's/^\(LABEL version_minor=\).*$$/\1$(MINOR)/' Containerfile
	npm run release -- --override $(version)
