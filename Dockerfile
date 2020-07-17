FROM node:14.5.0-alpine

# Checking container status
HEALTHCHECK --interval=5s --timeout=3s CMD node src/healthcheck.js || exit 1

# Create app directory
WORKDIR /usr/src/app

# Copy sources
COPY ./package*.json ./
COPY ./src ./src
COPY ./.env ./
COPY ./docker-entry.sh ./

# Install app dependencies
RUN npm install --only=production

CMD [ "./docker-entry.sh" ]
