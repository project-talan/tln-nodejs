FROM node:9.10.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy sources
COPY ./package*.json ./
COPY ./src ./src
COPY ./.env.template ./
COPY ./docker-entry.sh ./

# Install app dependencies
RUN apk --update --no-cache add git gettext
RUN npm install --only=production

CMD [ "./docker-entry.sh" ]
