FROM node:12.18.1
RUN mkdir -p /app
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
