FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 8080
CMD ["node", "vulnerable.js"]
