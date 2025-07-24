FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Use npm install instead of npm ci (no lock file present)
RUN npm install

COPY . .

CMD [ "node", "app.js" ]
