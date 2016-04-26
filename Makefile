.DEFAULT_GOAL := build
DOCKER_MACHINE=default
JSLINT_ARGS=--node --nomen --indent=2
JS_FILES=index.js lib/*.js
DOCKER_NODE_STD_ARGS=-it --rm -v $(shell pwd):/usr/src/app -w /usr/src/app
DOCKER_NODE_IMAGE=mhart/alpine-node:latest

npm:
	docker run $(DOCKER_NODE_STD_ARGS) $(DOCKER_NODE_IMAGE) npm install

jshint:
	docker run $(DOCKER_NODE_STD_ARGS) $(DOCKER_NODE_IMAGE) ./node_modules/jshint/bin/jshint $(JS_FILES);

jscs:
	docker run $(DOCKER_NODE_STD_ARGS) $(DOCKER_NODE_IMAGE) ./node_modules/jscs/bin/jscs $(JSLINT_ARGS) $(JS_FILES);

.test:
	docker run $(DOCKER_NODE_STD_ARGS) $(DOCKER_NODE_IMAGE) npm test;

validate: jshint jscs .test