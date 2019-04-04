FROM node:10

WORKDIR /usr/src/app

# https://www.npmjs.com/package/canvas
RUN apt-get update -y && apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY package*.json ./
COPY dist/ dist/

EXPOSE 3000

CMD [ "npm", "run", "docker:start"   ]