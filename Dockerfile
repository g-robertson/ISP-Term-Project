FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install -y \
    nodejs \
    postgresql
CMD node --unhandled-rejections=strict server.js
EXPOSE 8080

ADD . /www
WORKDIR www