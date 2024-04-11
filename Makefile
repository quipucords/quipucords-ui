
QUIPUCORDS_UI_CONTAINER_TAG ?= quipucords-ui

help:
	@echo "Please use 'make <target>' where <target> is one of:"
	@echo "  help                          to show this message"
	@echo "  build-container               to build the container image for the quipucords UI"

all: help

build-container:
	podman build \
		-t $(QUIPUCORDS_UI_CONTAINER_TAG) .

