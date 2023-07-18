FROM node:18-alpine As development

WORKDIR /app

COPY package*.json ./

COPY tsconfig*json ./


RUN npm ci --quiet

COPY ./prisma prisma
COPY ./src src
RUN npm run build
