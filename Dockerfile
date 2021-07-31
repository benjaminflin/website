FROM snazzybucket/idris2:latest as build

FROM node:latest

COPY --from=build /root/.idris2 /root/.idris2 

RUN apt-get update && apt-get install -y make chezscheme && rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.idris2/bin:${PATH}"