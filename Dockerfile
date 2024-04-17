FROM ghcr.io/puppeteer/puppeteer:22.6.4

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
DATABASE_URL=postgresql://news-archive-db_owner:PdMRiQ46sFkb@ep-gentle-surf-a528hvup-pooler.us-east-2.aws.neon.tech/news-archive-db?sslmode=require&schema=public&tmeout=0

USER root

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN npx prisma generate

CMD [ "yarn", "run", "start" ]

