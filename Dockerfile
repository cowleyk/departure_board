FROM node:10

WORKDIR /usr/src/app

COPY ./client/build ./client/build
COPY ./api .

# install server libraries
RUN npm install

CMD ["npm", "start"]
EXPOSE 3001
