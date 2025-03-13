
QUIPUCORDS_UI_CONTAINER_TAG ?= quipucords-ui

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Darwin)
  # macOS/Darwin's built-in `sed` is BSD-style and is incompatible with Linux/GNU-style `sed` arguments.
  # However, macOS users can install GNU sed as `gsed` alongside the built-in `sed` using Homebrew.
  ifneq ($(shell command -v gsed),)
    SED := gsed
  else
    $(info "Warning: gsed may be required on macOS, but it is not installed.")
    $(info "Please run 'brew install gnu-sed' to install it.")
    SED := sed # Fall back to default sed for now
  endif
else
  SED := sed
endif


help:
	@echo "Please use 'make <target>' where <target> is one of:"
	@echo "  help                          to show this message"
	@echo "  build-container               to build the container image for the quipucords UI"
	@echo "  lock-baseimages               update the digests of base images on the Containerfile"

all: help

build-container:
	podman build \
		-t $(QUIPUCORDS_UI_CONTAINER_TAG) --ulimit nofile=4096:4096 .

.PHONY: lock-baseimages
lock-baseimages:
	separator="================================================================"; \
	baseimages=($$(grep '^FROM ' Containerfile | sed 's/FROM\s*\(.*\)@.*/\1/g' | sort -u)); \
	for image in $${baseimages[@]}; do \
		echo "$${separator}"; \
		echo "updating $${image}..."; \
		# escape "/" for use in $(SED) later \
		escaped_img=$$(echo $${image} | $(SED) 's/\//\\\//g') ;\
		# extract the image digest \
		updated_sha=$$(skopeo inspect --raw "docker://$${image}:latest" | sha256sum | cut -d ' ' -f1); \
		# update Containerfile with the new digest \
		$(SED) -i "s/^\(FROM $${escaped_img}@sha256:\)[[:alnum:]]*/\1$${updated_sha}/g" Containerfile; \
	done; \
	echo "$${separator}"
