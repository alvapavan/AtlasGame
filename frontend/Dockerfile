FROM node:16-alpine
WORKDIR /app
COPY atlas-game/package*.json ./
RUN npm install
COPY atlas-game/ ./
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
