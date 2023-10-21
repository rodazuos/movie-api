.DEFAULT_GOAL := help
.PHONY: help test

DOCKER_STAGE ?= development
INTERACTIVE := $(shell [ -t 0 ] && echo i || echo d)
APPDIR = /usr/movie-service
PWD=$(shell pwd)
PORT=3001
PORT_DEBUG=13001
CONTAINER_NAME=movie-api
DOCKER_DATE_TAG=$(shell date +%Y-%m)

welcome:
	@echo "Welcome to ${CONTAINER_NAME}"

setup: welcome build-docker-image ## Install dependencies
	@cp -n .env.default .env

check-if-docker-image-exists:
ifeq ($(shell docker images -q hu/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG} 2> /dev/null | wc -l | bc),0)
	@echo "Docker image not found, building Docker image first"; sleep 2;
	@make build-docker-image
endif

build-docker-image:
	@echo "Building docker image from Dockerfile"
	@docker build --no-cache --force-rm . --target ${DOCKER_STAGE} -t service/${CONTAINER_NAME}:latest -t service/${CONTAINER_NAME}:date-${DOCKER_DATE_TAG}

start: welcome check-if-docker-image-exists
	@echo 'Running on http://localhost:$(PORT)'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -e BIN_PATH="yarn start" -p $(PORT):80 -p $(PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME} service/${CONTAINER_NAME}:latest

start-dev: welcome check-if-docker-image-exists
	@echo 'Running on http://localhost:$(PORT)'
	@docker run -t${INTERACTIVE} --rm -v ${PWD}:${APPDIR}:delegated --env-file=.env -e BIN_PATH="yarn start-dev" -p $(PORT):80 -p $(PORT_DEBUG):5858 -e USER_PERM=$(shell id -u):$(shell id -g) --name ${CONTAINER_NAME} service/${CONTAINER_NAME}:latest

stop: ## Stops project
	@docker stop ${CONTAINER_NAME}

restart: ## Restart project
	@make stop
	@make start

test: 
	@docker exec -t${INTERACTIVE} ${CONTAINER_NAME} yarn test

help: welcome
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep ^help -v | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'