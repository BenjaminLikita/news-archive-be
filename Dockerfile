FROM ghcr.io/puppeteer/puppeteer:22.6.4

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn --frozen-lockfile install

COPY . .

RUN npx prisma generate

CMD [ "yarn", "run", "start" ]