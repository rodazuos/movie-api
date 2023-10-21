FROM node:18-slim as base
    ENV APPDIR /usr/movie-service
    ENV BIN_PATH ${BIN_PATH}

    EXPOSE 3001

    WORKDIR $APPDIR

    RUN apt-get update && \
        rm -rf /var/cache/apt/* /tmp/* /var/tmp/*

FROM base as development
    ENV PORT 80
    ENV NODE_ENV development
    
    ENV YARN_CACHE_FOLDER /usr/movie-service/.caches/yarn

    ENTRYPOINT ["./Dockerfile_entrypoint.sh"]

FROM base as production
    ENV PORT 8080
    EXPOSE 8080

    ENV NODE_ENV production

    COPY . $APPDIR

    RUN yarn install

    CMD $BIN_PATH