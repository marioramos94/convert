FROM node:alpine

RUN apk add libreoffice 

RUN apk add msttcorefonts-installer && \
    update-ms-fonts && \
    fc-cache -f

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 80

CMD [ "node", "index.js" ]
