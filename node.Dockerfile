FROM node:18
RUN npm install -g gatsby-cli
CMD node --unhandled-rejections=strict server.js
EXPOSE 8080

# Get the node_modules
RUN mkdir -p /www/src
WORKDIR www
COPY package.json /www/package.json
RUN npm install

# Compile the gatsby pages
ADD ./src/components /www/src
ADD ./src/pages /www/src
ADD ./src/images /www/src
RUN gatsby build

# Add the rest
ADD . /www