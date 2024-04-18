FROM node:lts-alpine


WORKDIR /usr/src/app

COPY ["package.json", "yarn.lock" , "./"]

RUN npm install --global yarn

RUN yarn install 

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["yarn", "start"]
