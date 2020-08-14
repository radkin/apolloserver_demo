FROM node:latest

WORKDIR /app

# install npms
COPY package.json .
COPY package-lock.json .
RUN npm install

# copy app code
COPY . .

# my app port
EXPOSE 9000

CMD [ "node", "server" ]
